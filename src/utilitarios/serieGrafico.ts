import type { PontoHistoricoTipo } from '../tipos/Sensor'

/*
  Prepara o histórico bruto do sensor para o gráfico.

  Como o sensor fica ligado só em alguns períodos ("sessões"), o eixo X NÃO
  é o relógio puro: o tempo em que o sensor ficou desligado é "encolhido" e
  marcado com uma linha tracejada (igual aos gráficos de bolsa, que pulam
  o fim de semana). Dentro de cada sessão o tempo é real.

    1. leituras de cada sessão são agrupadas em baldes e viram a média
       (milhares de leituras viram ~120 pontos);
    2. entre uma sessão e outra a linha é interrompida;
    3. as marcas do eixo mostram a data/hora real de cada sessão.
*/

export type CampoSensorTipo = Exclude<keyof PontoHistoricoTipo, 'timestamp'>

export const CAMPOS_SENSOR: CampoSensorTipo[] = [
  'nitrogenio',
  'fosforo',
  'potassio',
  'temperatura',
  'umidade',
  'ph',
  'condutividade',
  'luminosidade',
]

// x = posição no eixo (ms de "tempo ativo"); timestamp = data/hora real
export type PontoGraficoTipo = { x: number; timestamp: number } & Record<CampoSensorTipo, number | null>

export type TickTipo = { x: number; rotulo: string }

export type SerieGraficoTipo = {
  pontos: PontoGraficoTipo[]
  fim: number
  ticks: TickTipo[]
  quebras: number[]
}

const ALVO_PONTOS = 120
const MAX_TICKS = 6
const MINUTO = 60 * 1000
const HORA = 60 * MINUTO
const DIA = 24 * HORA

const PASSOS_TICK = [
  1 * MINUTO, 5 * MINUTO, 10 * MINUTO, 15 * MINUTO, 30 * MINUTO,
  1 * HORA, 2 * HORA, 3 * HORA, 6 * HORA, 12 * HORA, 1 * DIA,
]

function mediana(valores: number[]): number {
  if (valores.length === 0) return 0
  const ordenados = [...valores].sort((a, b) => a - b)
  return ordenados[Math.floor(ordenados.length / 2)]
}

function arredondar(valor: number): number {
  return Math.round(valor * 100) / 100
}

export function formatarTick(timestamp: number, passoTick: number, duracao: number): string {
  const data = new Date(timestamp)
  const dia = data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
  const hora = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  if (passoTick >= DIA) return dia
  if (duracao > DIA) return `${dia} ${hora}`
  return hora
}

export function formatarDataCompleta(timestamp: number): string {
  return new Date(timestamp).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

// Marcas "redondas" (18:20, 18:30...) para uma sessão contínua
function ticksRedondos(inicio: number, fim: number): TickTipo[] {
  const duracao = Math.max(fim - inicio, MINUTO)
  const passo = PASSOS_TICK.find((p) => duracao / p <= MAX_TICKS) ?? PASSOS_TICK[PASSOS_TICK.length - 1]
  const desvio = -new Date(inicio).getTimezoneOffset() * MINUTO // alinha ao horário local
  const ticks: TickTipo[] = []
  for (let t = Math.ceil((inicio + desvio) / passo) * passo - desvio; t <= fim; t += passo) {
    ticks.push({ x: t - inicio, rotulo: formatarTick(t, passo, duracao) })
  }
  return ticks
}

type Sessao = { inicio: number; fim: number; deslocamento: number; amostras: PontoHistoricoTipo[] }

type Balde = {
  indice: number
  n: number
  somaX: number
  somaTempo: number
  soma: Record<CampoSensorTipo, number>
  contagem: Record<CampoSensorTipo, number>
}

function novoBalde(indice: number): Balde {
  const zeros = () => Object.fromEntries(CAMPOS_SENSOR.map((c) => [c, 0])) as Record<CampoSensorTipo, number>
  return { indice, n: 0, somaX: 0, somaTempo: 0, soma: zeros(), contagem: zeros() }
}

// historico: ordem crescente de tempo. duracaoMs null = "tudo".
export function montarSerie(
  historico: PontoHistoricoTipo[],
  duracaoMs: number | null,
  agora: number,
): SerieGraficoTipo | null {
  const inicioJanela = duracaoMs !== null ? agora - duracaoMs : -Infinity
  const validos = historico.filter((p) => p.timestamp >= inicioJanela && p.timestamp <= agora + HORA)
  if (validos.length === 0) return null

  // 1) separa em sessões (um buraco maior que o limite = sensor desligado)
  const intervalos = validos.slice(1).map((p, i) => p.timestamp - validos[i].timestamp)
  const limiteSessao = Math.max(mediana(intervalos) * 6, MINUTO)

  const sessoes: Sessao[] = []
  for (const ponto of validos) {
    const ultima = sessoes[sessoes.length - 1]
    if (!ultima || ponto.timestamp - ultima.fim > limiteSessao) {
      sessoes.push({ inicio: ponto.timestamp, fim: ponto.timestamp, deslocamento: 0, amostras: [ponto] })
    } else {
      ultima.fim = ponto.timestamp
      ultima.amostras.push(ponto)
    }
  }

  // 2) posiciona as sessões lado a lado, com uma folga pequena entre elas
  const duracaoDe = (s: Sessao) => Math.max(s.fim - s.inicio, 1000)
  const ativo = sessoes.reduce((soma, s) => soma + duracaoDe(s), 0)
  const folga = sessoes.length > 1 ? Math.max(ativo * 0.03, 5000) : 0
  let cursor = 0
  for (const s of sessoes) {
    s.deslocamento = cursor
    cursor += duracaoDe(s) + folga
  }
  const fim = cursor - folga
  const largura = Math.max(fim / ALVO_PONTOS, 1000)

  // 3) médias por balde, sessão a sessão; ponto vazio entre sessões quebra a linha
  const pontos: PontoGraficoTipo[] = []
  const quebras: number[] = []

  sessoes.forEach((sessao, posicao) => {
    const baldes: Balde[] = []
    for (const amostra of sessao.amostras) {
      const x = sessao.deslocamento + (amostra.timestamp - sessao.inicio)
      const indice = Math.floor((x - sessao.deslocamento) / largura)
      let balde = baldes[baldes.length - 1]
      if (!balde || balde.indice !== indice) {
        balde = novoBalde(indice)
        baldes.push(balde)
      }
      balde.n += 1
      balde.somaX += x
      balde.somaTempo += amostra.timestamp
      for (const campo of CAMPOS_SENSOR) {
        const valor = amostra[campo]
        if (typeof valor === 'number' && Number.isFinite(valor)) {
          balde.soma[campo] += valor
          balde.contagem[campo] += 1
        }
      }
    }

    for (const balde of baldes) {
      const ponto = { x: balde.somaX / balde.n, timestamp: balde.somaTempo / balde.n } as PontoGraficoTipo
      for (const campo of CAMPOS_SENSOR) {
        ponto[campo] = balde.contagem[campo] > 0 ? arredondar(balde.soma[campo] / balde.contagem[campo]) : null
      }
      pontos.push(ponto)
    }

    const proxima = sessoes[posicao + 1]
    if (proxima) {
      const xQuebra = sessao.deslocamento + duracaoDe(sessao) + folga / 2
      const vazio = { x: xQuebra, timestamp: proxima.inicio } as PontoGraficoTipo
      for (const campo of CAMPOS_SENSOR) vazio[campo] = null
      pontos.push(vazio)
      quebras.push(xQuebra)
    }
  })

  // 4) marcas do eixo
  let ticks: TickTipo[]
  if (sessoes.length === 1) {
    ticks = ticksRedondos(sessoes[0].inicio, sessoes[0].fim)
  } else {
    const escolhidas =
      sessoes.length <= MAX_TICKS
        ? sessoes
        : Array.from(
            new Set(Array.from({ length: MAX_TICKS }, (_, i) => Math.round((i * (sessoes.length - 1)) / (MAX_TICKS - 1)))),
          ).map((i) => sessoes[i])
    const total = sessoes[sessoes.length - 1].fim - sessoes[0].inicio
    ticks = escolhidas.map((s) => ({ x: s.deslocamento, rotulo: formatarTick(s.inicio, MINUTO, total) }))
  }

  return { pontos, fim, ticks, quebras }
}