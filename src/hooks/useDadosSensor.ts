import { useEffect, useRef, useState } from 'react'
import { collection, query, orderBy, limit, where, onSnapshot, Timestamp } from 'firebase/firestore'
import { firestore } from '../firebase/FirebaseConexao'
import type { LeituraSensorTipo, PontoHistoricoTipo, IntervaloTempoTipo } from '../tipos/Sensor'
import { INTERVALOS } from '../tipos/Sensor'

const COLECAO_LEITURAS = 'leituras_sensor'

// Teto de documentos lidos por consulta (protege site e cota do Firestore)
const LIMITE_DOCUMENTOS = 5000
// A tela só é redesenhada no máximo 1x a cada 30s, mesmo que o sensor envie a cada 5s
const ATUALIZACAO_HISTORICO_MS = 30 * 1000

// Se a última leitura for mais antiga que isso, o sensor é considerado desconectado.
// Precisa ser MAIOR que o intervalo de envio do ESP32 (hoje 5s) com folga.
// Se um dia aumentar o envio para 60s, suba para ~2 * 60 * 1000.
export const LIMITE_SENSOR_OFFLINE_MS = 15 * 1000

const CAMPOS_SENSOR = [
  'nitrogenio', 'fosforo', 'potassio', 'temperatura',
  'umidade', 'ph', 'condutividade', 'luminosidade',
] as const

// Converte o documento do Firestore em um ponto válido, ou null se for lixo de teste
// (sem timestamp, timestamp em formato errado ou data impossível)
function normalizarPonto(dados: Record<string, unknown>): PontoHistoricoTipo | null {
  let ts: unknown = dados.timestamp
  if (ts && typeof ts === 'object' && 'toMillis' in ts) {
    ts = (ts as { toMillis: () => number }).toMillis() // caso tenha sido salvo como Timestamp
  }
  if (typeof ts !== 'number' || !Number.isFinite(ts) || ts < 1_600_000_000_000) return null

  const ponto: Record<string, number> = { timestamp: ts }
  let temAlgumCampo = false
  for (const campo of CAMPOS_SENSOR) {
    const valor = dados[campo]
    if (typeof valor === 'number' && Number.isFinite(valor)) {
      ponto[campo] = valor
      temAlgumCampo = true
    } else {
      ponto[campo] = NaN
    }
  }
  return temAlgumCampo ? (ponto as unknown as PontoHistoricoTipo) : null
}

type DadosSensorTipo = {
  leituraAtual: LeituraSensorTipo | null
  sensorConectado: boolean
  historico: PontoHistoricoTipo[]
  carregando: boolean
  erro: string | null
}

/*
  useDadosSensor()          -> só a leitura atual (cards, alertas). Leve.
  useDadosSensor('1h')      -> leitura atual + histórico do intervalo (gráficos/relatórios).
*/
export function useDadosSensor(intervalo?: IntervaloTempoTipo): DadosSensorTipo {
  const [leituraAtual, setLeituraAtual] = useState<LeituraSensorTipo | null>(null)
  const [historico, setHistorico] = useState<PontoHistoricoTipo[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const ultimaAtualizacao = useRef(0)
  const [agora, setAgora] = useState(() => Date.now())

  // Reavalia a cada 1s se o sensor ainda está enviando dados
  useEffect(() => {
    const relogio = setInterval(() => setAgora(Date.now()), 1000)
    return () => clearInterval(relogio)
  }, [])

  const sensorConectado =
    leituraAtual !== null && agora - leituraAtual.atualizadoEm <= LIMITE_SENSOR_OFFLINE_MS

  // Último registro do sensor (1 documento só, atualiza em tempo real)
  useEffect(() => {
    const consultaAtual = query(
      collection(firestore, COLECAO_LEITURAS),
      orderBy('timestamp', 'desc'),
      limit(1),
    )

    const pararAtual = onSnapshot(
      consultaAtual,
      (snapshot) => {
        if (snapshot.empty) {
          setLeituraAtual(null)
        } else {
          const dados = normalizarPonto(snapshot.docs[0].data())
          setLeituraAtual(dados ? { ...dados, atualizadoEm: dados.timestamp } : null)
        }
        setCarregando(false)
      },
      (erroFirestore) => {
        setErro(erroFirestore.message)
        setCarregando(false)
      },
    )

    return () => pararAtual()
  }, [])

  // Histórico: só é buscado quando um intervalo é pedido
  useEffect(() => {
    if (!intervalo) return

    const config = INTERVALOS.find((item) => item.valor === intervalo)
    const duracao = config?.milissegundos ?? null
    const colecao = collection(firestore, COLECAO_LEITURAS)

    /*
      O campo "timestamp" pode estar salvo de dois jeitos no Firestore: como NÚMERO
      (milissegundos) ou como DATA (Timestamp). Um filtro por número NÃO enxerga
      documentos salvos como data (e vice-versa). Por isso, nos intervalos com
      filtro, rodamos uma consulta para cada tipo e juntamos o resultado.
    */
    const corteInicial = duracao !== null ? Date.now() - duracao : 0
    const consultas =
      duracao === null
        ? [query(colecao, orderBy('timestamp', 'desc'), limit(LIMITE_DOCUMENTOS))]
        : [
            query(
              colecao,
              where('timestamp', '>=', Timestamp.fromMillis(corteInicial)),
              orderBy('timestamp', 'desc'),
              limit(LIMITE_DOCUMENTOS),
            ),
            query(
              colecao,
              where('timestamp', '>=', corteInicial),
              orderBy('timestamp', 'desc'),
              limit(LIMITE_DOCUMENTOS),
            ),
          ]

    const resultados: PontoHistoricoTipo[][] = consultas.map(() => [])
    const recebeu: boolean[] = consultas.map(() => false)
    let temporizador: ReturnType<typeof setTimeout> | null = null
    ultimaAtualizacao.current = 0

    const publicar = () => {
      temporizador = null
      ultimaAtualizacao.current = Date.now()
      const corte = duracao !== null ? Date.now() - duracao : 0
      const juntos = resultados
        .flat()
        .filter((p) => p.timestamp >= corte)
        .sort((x, y) => x.timestamp - y.timestamp)
      setHistorico(juntos)
    }

    const aoReceber = () => {
      // primeira exibição: espera TODAS as consultas responderem uma vez
      if (ultimaAtualizacao.current === 0) {
        if (recebeu.every(Boolean)) publicar()
        return
      }
      const passou = Date.now() - ultimaAtualizacao.current
      if (passou >= ATUALIZACAO_HISTORICO_MS) {
        if (temporizador) clearTimeout(temporizador)
        publicar()
      } else if (!temporizador) {
        temporizador = setTimeout(publicar, ATUALIZACAO_HISTORICO_MS - passou)
      }
    }

    const parar = consultas.map((consulta, i) =>
      onSnapshot(
        consulta,
        (snapshot) => {
          resultados[i] = snapshot.docs
            .map((doc) => normalizarPonto(doc.data()))
            .filter((p): p is PontoHistoricoTipo => p !== null)
          recebeu[i] = true
          aoReceber()
        },
        (erroFirestore) => setErro(erroFirestore.message),
      ),
    )

    return () => {
      parar.forEach((cancelar) => cancelar())
      if (temporizador) clearTimeout(temporizador)
    }
  }, [intervalo])

  return { leituraAtual, sensorConectado, historico, carregando, erro }
}