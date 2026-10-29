import estilos from './Relatorios.module.css'
import { type RelatorioGeradoTipo, type TipoRelatorio } from '../tipos/Relatorios'
import { useState } from 'react'
import { collection, getDocs, query, where, orderBy, limit, Timestamp } from 'firebase/firestore'
import { firestore } from '../firebase/FirebaseConexao'
import { normalizarPonto } from '../hooks/useDadosSensor'
import { type PontoHistoricoTipo } from '../tipos/Sensor'
import { calcularRelatorio, inicioDoPeriodo } from '../utilitarios/relatorioDados'

const ROTULO_TIPO: Record<TipoRelatorio, string> = {
  diario: 'Diário',
  semanal: 'Semanal',
  mensal: 'Mensal',
}

const LIMITE_LEITURAS = 10000 // o Firestore não aceita mais que 10.000 por consulta

// Busca só as leituras do período do relatório (uma vez, ao clicar no botão).
// Consulta os dois formatos possíveis do campo timestamp (data e número).
async function buscarLeituras(inicioMs: number): Promise<PontoHistoricoTipo[]> {
  const colecao = collection(firestore, 'leituras_sensor')
  const [porData, porNumero] = await Promise.all([
    getDocs(
      query(colecao, where('timestamp', '>=', Timestamp.fromMillis(inicioMs)), orderBy('timestamp', 'desc'), limit(LIMITE_LEITURAS)),
    ),
    getDocs(
      query(colecao, where('timestamp', '>=', inicioMs), orderBy('timestamp', 'desc'), limit(LIMITE_LEITURAS)),
    ),
  ])

  return [...porData.docs, ...porNumero.docs]
    .map((doc) => normalizarPonto(doc.data()))
    .filter((ponto): ponto is PontoHistoricoTipo => ponto !== null)
    .sort((x, y) => x.timestamp - y.timestamp)
}

function formatarTamanho(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  return `${(bytes / 1024).toFixed(0)} KB`
}

export function Relatorios() {
  const [tipoSelecionado, setTipoSelecionado] = useState<TipoRelatorio>('semanal')
  const [relatorios, setRelatorios] = useState<RelatorioGeradoTipo[]>([])
  const [gerando, setGerando] = useState(false)
  const [mensagem, setMensagem] = useState('')

  async function gerarRelatorio() {
    setGerando(true)
    setMensagem('')

    try {
      const agora = Date.now()
      const leituras = await buscarLeituras(inicioDoPeriodo(tipoSelecionado, agora))
      const dadosRelatorio = calcularRelatorio(leituras, tipoSelecionado, agora)

      if (!dadosRelatorio) {
        setMensagem('Não há dados registrados nesse período ainda para gerar o relatório.')
        return
      }

      // o gerador de PDF só é carregado aqui, para não pesar o resto do site
      const { gerarPdf } = await import('../utilitarios/relatorioPdf')
      const blob = gerarPdf(dadosRelatorio)
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

      // download automático
      const link = document.createElement('a')
      link.href = url
      link.download = `${novoRelatorio.nome}.pdf`
      link.click()
    } catch (erro) {
      console.error(erro)
      const detalhe = erro instanceof Error ? erro.message : String(erro)
      setMensagem(`Não foi possível gerar o relatório. Motivo: ${detalhe}`)
    } finally {
      setGerando(false)
    }
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
          disabled={gerando}
        >
          {gerando ? 'Gerando PDF...' : `Gerar Relatório ${ROTULO_TIPO[tipoSelecionado]}`}
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
                      download={`${relatorio.nome}.pdf`}
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