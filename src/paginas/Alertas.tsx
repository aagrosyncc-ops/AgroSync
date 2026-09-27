import estilos from './Alertas.module.css'
import { type AlertaTipo } from '../tipos/Alertas'
import { useEffect, useMemo, useState } from 'react'
import { useDadosSensor } from '../hooks/useDadosSensor'
import { useConfiguracoes } from '../hooks/useConfiguracoes'
import { FAIXAS_IDEAIS, calcularSeveridade } from '../tipos/FaixasIdeais'

const CHAVE_LOCALSTORAGE_LIDOS = 'agrosync:alertas-lidos'

function carregarLidos(): Set<string> {
  try {
    const bruto = localStorage.getItem(CHAVE_LOCALSTORAGE_LIDOS)
    return bruto ? new Set(JSON.parse(bruto) as string[]) : new Set()
  } catch {
    return new Set()
  }
}

function salvarLidos(lidos: Set<string>): void {
  try {
    localStorage.setItem(CHAVE_LOCALSTORAGE_LIDOS, JSON.stringify(Array.from(lidos)))
  } catch {

  }
}

function formatarTempoRelativo(timestampMs: number): string {
  const diferencaMs = Date.now() - timestampMs
  const minutos = Math.floor(diferencaMs / 60000)
  if (minutos < 1) return 'agora mesmo'
  if (minutos < 60) return `Há ${minutos} minuto${minutos > 1 ? 's' : ''}`
  const horas = Math.floor(minutos / 60)
  if (horas < 24) return `Há ${horas} hora${horas > 1 ? 's' : ''}`
  const dias = Math.floor(horas / 24)
  return `Há ${dias} dia${dias > 1 ? 's' : ''}`
}

type Aba = 'todos' | 'critico' | 'atencao' | 'informacao'

export function Alertas() {
  const { leituraAtual, carregando } = useDadosSensor()
  const { configuracoes } = useConfiguracoes()
  const [aba, setAba] = useState<Aba>('todos')
  const [lidos, setLidos] = useState<Set<string>>(() => carregarLidos())

  const alertas = useMemo<AlertaTipo[]>(() => {
    if (!leituraAtual) return []

    const lista: AlertaTipo[] = []

    for (const faixa of FAIXAS_IDEAIS) {
      const valor = leituraAtual[faixa.chave]
      const severidade = calcularSeveridade(valor, faixa)

      if (severidade === 'critico' && !configuracoes.alertasCriticos) continue

      if (severidade === 'atencao') {
        lista.push({
          id: `atencao-${faixa.chave}`,
          titulo: `${faixa.rotulo} fora do ideal`,
          descricao: `${faixa.rotulo} está em ${valor}${faixa.unidade ? ' ' + faixa.unidade : ''}, fora da faixa ideal de ${faixa.min} - ${faixa.max}${faixa.unidade ? ' ' + faixa.unidade : ''}.`,
          severidade: 'atencao',
          categoria: 'atencao',
          quandoMs: leituraAtual.atualizadoEm,
        })
      } else if (severidade === 'critico') {
        lista.push({
          id: `critico-${faixa.chave}`,
          titulo: `${faixa.rotulo} em nível crítico`,
          descricao: `${faixa.rotulo} está em ${valor}${faixa.unidade ? ' ' + faixa.unidade : ''}, bem fora da faixa ideal de ${faixa.min} - ${faixa.max}${faixa.unidade ? ' ' + faixa.unidade : ''}. Verifique o solo o quanto antes.`,
          severidade: 'critico',
          categoria: 'critico',
          quandoMs: leituraAtual.atualizadoEm,
        })
      }
    }

    if (lista.length === 0) {
      lista.push({
        id: 'sucesso-npk',
        titulo: 'Níveis dentro do ideal',
        descricao: 'Todos os parâmetros monitorados estão dentro da faixa ideal na última leitura.',
        severidade: 'sucesso',
        categoria: 'informacao',
        quandoMs: leituraAtual.atualizadoEm,
      })
    }

    lista.push({
      id: 'info-ultima-leitura',
      titulo: 'Última leitura do sensor',
      descricao: `Dados atualizados ${formatarTempoRelativo(leituraAtual.atualizadoEm)}.`,
      severidade: 'info',
      categoria: 'informacao',
      quandoMs: leituraAtual.atualizadoEm,
    })

    return lista.sort((a, b) => b.quandoMs - a.quandoMs)
  }, [leituraAtual, configuracoes.alertasCriticos])

  const [alertasAnteriores, setAlertasAnteriores] = useState(alertas)
  if (alertas !== alertasAnteriores) {
    setAlertasAnteriores(alertas)
    if (alertas.length > 0) {
      const idsAtuais = new Set(alertas.map((alerta) => alerta.id))
      const filtrado = new Set(Array.from(lidos).filter((id) => idsAtuais.has(id)))
      if (filtrado.size !== lidos.size) setLidos(filtrado)
    }
  }

  useEffect(() => {
    salvarLidos(lidos)
  }, [lidos])

  const naoLidos = alertas.filter((a) => !lidos.has(a.id))

  const alertasFiltrados = alertas.filter((a) => {
    if (aba === 'todos') return true
    return a.categoria === aba
  })

  function marcarTodosComoLidos() {
    const todosIds = new Set(alertas.map((a) => a.id))
    setLidos(todosIds)
    salvarLidos(todosIds)
  }

  function rotuloSeveridade(severidade: AlertaTipo['severidade']): string {
    if (severidade === 'critico') return 'CRÍTICO'
    if (severidade === 'atencao') return 'ATENÇÃO'
    if (severidade === 'sucesso') return 'SUCESSO'
    return 'INFORMAÇÃO'
  }

  function iconeSeveridade(severidade: AlertaTipo['severidade']): string {
    if (severidade === 'critico') return '!'
    if (severidade === 'atencao') return '!'
    if (severidade === 'sucesso') return '✓'
    return 'i'
  }

  if (carregando) {
    return (
      <div className={estilos.conteiner}>
        <p className={estilos.mensagemEstado}>Carregando alertas...</p>
      </div>
    )
  }

  if (!leituraAtual) {
    return (
      <div className={estilos.conteiner}>
        <h1 className={estilos.titulo}>Alertas</h1>
        <p className={estilos.mensagemEstado}>
          Nenhuma leitura do sensor disponível ainda — assim que o ESP32 publicar dados, os alertas
          aparecem aqui automaticamente.
        </p>
      </div>
    )
  }

  return (
    <div className={estilos.conteiner}>
      <div className={estilos.cabecalho}>
        <div>
          <h1 className={estilos.titulo}>Alertas</h1>
          <p className={estilos.subtitulo}>
            {naoLidos.length > 0
              ? `Você tem ${naoLidos.length} alerta${naoLidos.length > 1 ? 's' : ''} não lido${naoLidos.length > 1 ? 's' : ''}`
              : 'Todos os alertas foram lidos'}
          </p>
        </div>
        <button className={estilos.botaoMarcarLidos} onClick={marcarTodosComoLidos}>
          Marcar todos como lidos
        </button>
      </div>

      <div className={estilos.abas}>
        <button
          className={aba === 'todos' ? estilos.abaAtiva : estilos.aba}
          onClick={() => setAba('todos')}
        >
          Todos
        </button>
        <button
          className={aba === 'critico' ? estilos.abaAtiva : estilos.aba}
          onClick={() => setAba('critico')}
        >
          Críticos
        </button>
        <button
          className={aba === 'atencao' ? estilos.abaAtiva : estilos.aba}
          onClick={() => setAba('atencao')}
        >
          Atenção
        </button>
        <button
          className={aba === 'informacao' ? estilos.abaAtiva : estilos.aba}
          onClick={() => setAba('informacao')}
        >
          Informações
        </button>
      </div>

      <div className={estilos.lista}>
        {alertasFiltrados.map((alerta) => (
          <div
            key={alerta.id}
            className={`${estilos.cartao} ${estilos['borda_' + alerta.severidade]}`}
          >
            <div className={`${estilos.icone} ${estilos['icone_' + alerta.severidade]}`}>
              {iconeSeveridade(alerta.severidade)}
            </div>
            <div className={estilos.conteudoAlerta}>
              <div className={estilos.linhaTitulo}>
                <strong>{alerta.titulo}</strong>
                <span className={`${estilos.rotuloDestaque} ${estilos['badge_' + alerta.severidade]}`}>
                  {rotuloSeveridade(alerta.severidade)}
                </span>
              </div>
              <p className={estilos.descricaoAlerta}>{alerta.descricao}</p>
              <span className={estilos.tempoAlerta}>{formatarTempoRelativo(alerta.quandoMs)}</span>
            </div>
            {!lidos.has(alerta.id) && <span className={estilos.pontoNaoLido} />}
          </div>
        ))}

        {alertasFiltrados.length === 0 && (
          <p className={estilos.mensagemEstado}>Nenhum alerta nessa categoria no momento.</p>
        )}
      </div>
    </div>
  )
}
