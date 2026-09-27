export type TipoRelatorio = 'diario' | 'semanal' | 'mensal'

export type RelatorioGeradoTipo = {
  id: string
  nome: string
  tipo: TipoRelatorio
  dataGeracao: number
  tamanhoBytes: number
  url: string
}
