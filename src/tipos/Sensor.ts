export type LeituraSensorTipo = {
  nitrogenio: number
  fosforo: number
  potassio: number
  temperatura: number
  umidade: number
  ph: number
  condutividade: number
  luminosidade: number
  atualizadoEm: number
}

export type PontoHistoricoTipo = {
  nitrogenio: number
  fosforo: number
  potassio: number
  temperatura: number
  umidade: number
  ph: number
  condutividade: number
  luminosidade: number
  timestamp: number
}

export type IntervaloTempoTipo = '1h' | '6h' | '24h' | '7d' | 'tudo'

export type OpcaoIntervaloTipo = {
  valor: IntervaloTempoTipo
  rotulo: string
  milissegundos: number | null
}

export const INTERVALOS: OpcaoIntervaloTipo[] = [
  { valor: '1h', rotulo: '1 hora', milissegundos: 60 * 60 * 1000 },
  { valor: '6h', rotulo: '6 horas', milissegundos: 6 * 60 * 60 * 1000 },
  { valor: '24h', rotulo: '24 horas', milissegundos: 24 * 60 * 60 * 1000 },
  { valor: '7d', rotulo: '7 dias', milissegundos: 7 * 24 * 60 * 60 * 1000 },
  { valor: 'tudo', rotulo: 'Tudo', milissegundos: null },
]