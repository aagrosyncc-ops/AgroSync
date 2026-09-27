export type ConfiguracoesUsuarioTipo = {
  notificacoesAtivas: boolean
  notificacoesPorEmail: boolean
  alertasCriticos: boolean
  intervaloAtualizacaoMinutos: number
  unidadeTemperatura: 'celsius' | 'fahrenheit'
  modoEscuro: boolean
}

export const CONFIGURACOES_PADRAO: ConfiguracoesUsuarioTipo = {
  notificacoesAtivas: true,
  notificacoesPorEmail: true,
  alertasCriticos: true,
  intervaloAtualizacaoMinutos: 5,
  unidadeTemperatura: 'celsius',
  modoEscuro: false,
}

export function celsiusParaFahrenheit(celsius: number): number {
  return celsius * (9 / 5) + 32
}
