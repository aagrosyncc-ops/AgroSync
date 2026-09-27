import type { LeituraSensorTipo } from './Sensor'

export type FaixaIdealTipo = {
  chave: keyof Omit<LeituraSensorTipo, 'atualizadoEm'>
  rotulo: string
  unidade: string
  min: number
  max: number
}

export const FAIXAS_IDEAIS: FaixaIdealTipo[] = [
  { chave: 'nitrogenio', rotulo: 'Nitrogênio (N)', unidade: 'mg/kg', min: 40, max: 60 },
  { chave: 'fosforo', rotulo: 'Fósforo (P)', unidade: 'mg/kg', min: 30, max: 50 },
  { chave: 'potassio', rotulo: 'Potássio (K)', unidade: 'mg/kg', min: 45, max: 65 },
  { chave: 'temperatura', rotulo: 'Temperatura', unidade: '°C', min: 20, max: 28 },
  { chave: 'umidade', rotulo: 'Umidade', unidade: '%', min: 60, max: 80 },
  { chave: 'ph', rotulo: 'pH do Solo', unidade: '', min: 5.8, max: 6.8 },
  { chave: 'condutividade', rotulo: 'Condutividade (EC)', unidade: 'µS/cm', min: 200, max: 800 },
  { chave: 'luminosidade', rotulo: 'Luminosidade', unidade: 'lux', min: 600, max: 1000 },
]

export type SeveridadeParametroTipo = 'ok' | 'atencao' | 'critico'

export function calcularSeveridade(valor: number, faixa: FaixaIdealTipo): SeveridadeParametroTipo {
  if (valor >= faixa.min && valor <= faixa.max) return 'ok'

  const tamanhoFaixa = faixa.max - faixa.min
  const desvio = valor < faixa.min ? faixa.min - valor : valor - faixa.max
  const desvioRelativo = desvio / tamanhoFaixa

  return desvioRelativo > 0.15 ? 'critico' : 'atencao'
}