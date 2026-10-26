import { LeituraSensorTipo } from '@/tipos/Sensor'

export type FaixaIdealTipo = {
  chave: keyof Omit<LeituraSensorTipo, 'timestamp'>
  rotulo: string
  unidade: string
  min: number
  max: number
}

export type CulturaTipo = 'padrao' | 'hortalicas'

// nome que aparece na tela pra cada cultura
export const NOMES_CULTURA: Record<CulturaTipo, string> = {
  padrao: 'Padrão (não definida)',
  hortalicas: 'Hortaliças',
}

// uma tabela de faixas ideais PRA CADA cultura
export const FAIXAS_POR_CULTURA: Record<CulturaTipo, FaixaIdealTipo[]> = {

  padrao: [
    { chave: 'nitrogenio', rotulo: 'Nitrogênio (N)', unidade: 'mg/kg', min: 40, max: 60 },
    { chave: 'fosforo', rotulo: 'Fósforo (P)', unidade: 'mg/kg', min: 30, max: 50 },
    { chave: 'potassio', rotulo: 'Potássio (K)', unidade: 'mg/kg', min: 45, max: 65 },
    { chave: 'temperatura', rotulo: 'Temperatura', unidade: '°C', min: 20, max: 28 },
    { chave: 'umidade', rotulo: 'Umidade', unidade: '%', min: 60, max: 80 },
    { chave: 'ph', rotulo: 'pH do Solo', unidade: '', min: 5.8, max: 6.8 },
    { chave: 'condutividade', rotulo: 'Condutividade (EC)', unidade: 'µS/cm', min: 200, max: 800 },
    { chave: 'luminosidade', rotulo: 'Luminosidade', unidade: 'lux', min: 600, max: 1000 },
  ],

  hortalicas: [
    { chave: 'nitrogenio', rotulo: 'Nitrogênio (N)', unidade: 'mg/kg', min: 50, max: 70 },
    { chave: 'fosforo', rotulo: 'Fósforo (P)', unidade: 'mg/kg', min: 30, max: 50 },
    { chave: 'potassio', rotulo: 'Potássio (K)', unidade: 'mg/kg', min: 40, max: 60 },
    { chave: 'temperatura', rotulo: 'Temperatura', unidade: '°C', min: 18, max: 25 },
    { chave: 'umidade', rotulo: 'Umidade', unidade: '%', min: 70, max: 90 },
    { chave: 'ph', rotulo: 'pH do Solo', unidade: '', min: 6.0, max: 7.0 },
    { chave: 'condutividade', rotulo: 'Condutividade (EC)', unidade: 'µS/cm', min: 200, max: 800 },
    { chave: 'luminosidade', rotulo: 'Luminosidade', unidade: 'lux', min: 400, max: 800 },
  ],

}