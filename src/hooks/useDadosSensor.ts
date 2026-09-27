import { useEffect, useState } from 'react'
import { collection, query, orderBy, limit, where, onSnapshot } from 'firebase/firestore'
import { firestore } from '../firebase/FirebaseConexao'
import type { LeituraSensorTipo, PontoHistoricoTipo, IntervaloTempoTipo } from '../tipos/Sensor'
import { INTERVALOS } from '../tipos/Sensor'

const COLECAO_LEITURAS = 'leituras_sensor'

type DadosSensorTipo = {
  leituraAtual: LeituraSensorTipo | null
  historico: PontoHistoricoTipo[]
  carregando: boolean
  erro: string | null
}

export function useDadosSensor(intervalo: IntervaloTempoTipo = 'tudo'): DadosSensorTipo {
  const [leituraAtual, setLeituraAtual] = useState<LeituraSensorTipo | null>(null)
  const [historico, setHistorico] = useState<PontoHistoricoTipo[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  // Lê sempre o ultimo registro do nosso sensor npk do firestore
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
          const dados = snapshot.docs[0].data() as PontoHistoricoTipo
          setLeituraAtual({ ...dados, atualizadoEm: dados.timestamp })
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

  // Histórico filtrado pelo intervalo escolhido (1h / 6h / 24h / 7d / tudo)
  useEffect(() => {
    const config = INTERVALOS.find((item) => item.valor === intervalo)

    const consultaHistorico =
      config && config.milissegundos !== null
        ? query(
            collection(firestore, COLECAO_LEITURAS),
            where('timestamp', '>=', Date.now() - config.milissegundos),
            orderBy('timestamp', 'asc'),
          )
        : query(collection(firestore, COLECAO_LEITURAS), orderBy('timestamp', 'asc'))

    const pararHistorico = onSnapshot(consultaHistorico, (snapshot) => {
      const lista = snapshot.docs.map((doc) => doc.data() as PontoHistoricoTipo)
      setHistorico(lista)
    })

    return () => pararHistorico()
  }, [intervalo])

  return { leituraAtual, historico, carregando, erro }
}