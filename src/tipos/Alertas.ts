import { type SeveridadeParametroTipo } from './FaixasIdeais'

export type AlertaTipo = {
  id: string
  titulo: string
  descricao: string
  severidade: SeveridadeParametroTipo | 'sucesso' | 'info'
  categoria: 'critico' | 'atencao' | 'informacao'
  quandoMs: number
}
