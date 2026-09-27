import estilos from './Relatorios.module.css'
import { type RelatorioGeradoTipo, type TipoRelatorio } from '../tipos/Relatorios'
import { useState } from 'react'
import { useDadosSensor } from '../hooks/useDadosSensor'
import { FAIXAS_IDEAIS } from '../tipos/FaixasIdeais'
import { type PontoHistoricoTipo } from '../tipos/Sensor'

const DIAS_POR_TIPO: Record<TipoRelatorio, number> = {
  diario: 1,
  semanal: 7,
  mensal: 30,
}

const ROTULO_TIPO: Record<TipoRelatorio, string> = {
  diario: 'Diário',
  semanal: 'Semanal',
  mensal: 'Mensal',
}



function montarCsv(historico: PontoHistoricoTipo[]): string {
  const cabecalho = ['data_hora', ...FAIXAS_IDEAIS.map((f) => f.chave)].join(',')

  const linhas = historico.map((ponto) => {
    const dataHora = new Date(ponto.timestamp).toLocaleString('pt-BR')
    const valores = FAIXAS_IDEAIS.map((f) => ponto[f.chave])
    return [dataHora, ...valores].join(',')
  })

  return [cabecalho, ...linhas].join('\n')
}

function formatarTamanho(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  return `${(bytes / 1024).toFixed(0)} KB`
}

export function Relatorios() {
  const [tipoSelecionado, setTipoSelecionado] = useState<TipoRelatorio>('semanal')
  const { historico, carregando } = useDadosSensor('tudo')
  const [relatorios, setRelatorios] = useState<RelatorioGeradoTipo[]>([])
  const [gerando, setGerando] = useState(false)
  const [mensagem, setMensagem] = useState('')

  function gerarRelatorio() {
    const diasCorte = DIAS_POR_TIPO[tipoSelecionado]
    const corte = Date.now() - diasCorte * 24 * 60 * 60 * 1000
    const dadosDoPeriodo = historico.filter((ponto) => ponto.timestamp >= corte)

    if (dadosDoPeriodo.length === 0) {
      setMensagem('Não há dados registrados nesse período ainda para gerar o relatório.')
      return
    }

    setGerando(true)
    setMensagem('')

    const csv = montarCsv(dadosDoPeriodo)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)

    const dataFormatada = new Date().toISOString().slice(0, 10)
    const novoRelatorio: RelatorioGeradoTipo = {
      id: `${Date.now()}`,
      nome: `Relatório ${ROTULO_TIPO[tipoSelecionado]} - ${dataFormatada}`,
      tipo: tipoSelecionado,
      dataGeracao: Date.now(),
      tamanhoBytes: blob.size,
      url,
    }

    setRelatorios((atual) => [novoRelatorio, ...atual])

    //download
    const link = document.createElement('a')
    link.href = url
    link.download = `${novoRelatorio.nome}.csv`
    link.click()

    setGerando(false)
  }

  return (
    <div className={estilos.conteiner}>
      <h1 className={estilos.titulo}>Relatórios</h1>
      <p className={estilos.subtitulo}>Gere e exporte relatórios com os dados reais do sensor</p>

      <div className={estilos.cartao}>
        <h2 className={estilos.tituloCartao}>Gerar Novo Relatório</h2>
        <hr className={estilos.linha} />

        <p className={estilos.rotuloCampo}>Tipo de Relatório</p>
        <div className={estilos.botoesTipo}>
          <button
            className={tipoSelecionado === 'diario' ? estilos.botaoTipoAtivo : estilos.botaoTipo}
            onClick={() => setTipoSelecionado('diario')}
          >
            Diário (24h)
          </button>
          <button
            className={tipoSelecionado === 'semanal' ? estilos.botaoTipoAtivo : estilos.botaoTipo}
            onClick={() => setTipoSelecionado('semanal')}
          >
            Semanal (7 dias)
          </button>
          <button
            className={tipoSelecionado === 'mensal' ? estilos.botaoTipoAtivo : estilos.botaoTipo}
            onClick={() => setTipoSelecionado('mensal')}
          >
            Mensal (30 dias)
          </button>
        </div>

        <button
          className={estilos.botaoGerar}
          onClick={gerarRelatorio}
          disabled={carregando || gerando}
        >
          {carregando
            ? 'Carregando dados do sensor...'
            : gerando
              ? 'Gerando...'
              : `Gerar Relatório ${ROTULO_TIPO[tipoSelecionado]}`}
        </button>

        {mensagem && <p className={estilos.mensagem}>{mensagem}</p>}
      </div>

      <div className={estilos.cartao}>
        <h2 className={estilos.tituloCartao}>Relatórios Anteriores</h2>
        <p className={estilos.avisoSessao}>
          Esses relatórios ficam disponíveis apenas nesta sessão do navegador — para manter o
          histórico entre acessos, seria necessário guardar os arquivos em um storage na nuvem.
        </p>

        {relatorios.length === 0 ? (
          <p className={estilos.mensagemEstado}>Nenhum relatório gerado ainda nesta sessão.</p>
        ) : (
          <table className={estilos.tabela}>
            <thead>
              <tr>
                <th>Nome do Relatório</th>
                <th>Data</th>
                <th>Tipo</th>
                <th>Tamanho</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {relatorios.map((relatorio) => (
                <tr key={relatorio.id}>
                  <td>{relatorio.nome}</td>
                  <td>{new Date(relatorio.dataGeracao).toLocaleDateString('pt-BR')}</td>
                  <td>
                    <span className={estilos.rotuloTipo}>{ROTULO_TIPO[relatorio.tipo]}</span>
                  </td>
                  <td>{formatarTamanho(relatorio.tamanhoBytes)}</td>
                  <td>
                    <a
                      href={relatorio.url}
                      download={`${relatorio.nome}.csv`}
                      className={estilos.botaoBaixar}
                    >
                      Baixar
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
