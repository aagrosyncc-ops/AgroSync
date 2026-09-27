import estilos from './Configuracoes.module.css'
import { useConfiguracoes } from '../hooks/useConfiguracoes'

export function Configuracoes() {
  const { configuracoes, carregando, salvar } = useConfiguracoes()

  if (carregando) {
    return (
      <div className={estilos.conteiner}>
        <p className={estilos.mensagemEstado}>Carregando configurações...</p>
      </div>
    )
  }

  return (
    <div className={estilos.conteiner}>
      <h1 className={estilos.titulo}>Configurações</h1>
      <p className={estilos.subtitulo}>Personalize as preferências do sistema</p>

      <div className={estilos.cartao}>
        <h2 className={estilos.tituloCartao}>🔔 Notificações</h2>
        <hr className={estilos.linha} />

        <div className={estilos.linhaConfig}>
          <div>
            <p className={estilos.rotulo}>Ativar Notificações</p>
            <p className={estilos.descricao}>Receba alertas sobre suas plantações</p>
          </div>
          <button
            className={configuracoes.notificacoesAtivas ? estilos.alternadorAtivo : estilos.alternador}
            onClick={() => salvar({ notificacoesAtivas: !configuracoes.notificacoesAtivas })}
            aria-pressed={configuracoes.notificacoesAtivas}
          >
            <span className={estilos.indicadorAlternador} />
          </button>
        </div>

        <div className={estilos.linhaConfig}>
          <div>
            <p className={estilos.rotulo}>Notificações por E-mail</p>
            <p className={estilos.descricao}>
              Receba relatórios por e-mail (requer backend de envio, ainda não implementado)
            </p>
          </div>
          <button
            className={configuracoes.notificacoesPorEmail ? estilos.alternadorAtivo : estilos.alternador}
            onClick={() => salvar({ notificacoesPorEmail: !configuracoes.notificacoesPorEmail })}
            aria-pressed={configuracoes.notificacoesPorEmail}
          >
            <span className={estilos.indicadorAlternador} />
          </button>
        </div>

        <div className={estilos.linhaConfig}>
          <div>
            <p className={estilos.rotulo}>Alertas Críticos</p>
            <p className={estilos.descricao}>Mostrar alertas críticos na página de Alertas</p>
          </div>
          <button
            className={configuracoes.alertasCriticos ? estilos.alternadorAtivo : estilos.alternador}
            onClick={() => salvar({ alertasCriticos: !configuracoes.alertasCriticos })}
            aria-pressed={configuracoes.alertasCriticos}
          >
            <span className={estilos.indicadorAlternador} />
          </button>
        </div>
      </div>

      <div className={estilos.cartao}>
        <h2 className={estilos.tituloCartao}>📶 Dispositivos e Sensores</h2>
        <hr className={estilos.linha} />

        <div className={estilos.linhaConfig}>
          <div>
            <p className={estilos.rotulo}>Intervalo de Atualização</p>
            <p className={estilos.descricao}>Frequência esperada de envio de dados pelo ESP32</p>
          </div>
          <select
            className={estilos.selecao}
            value={configuracoes.intervaloAtualizacaoMinutos}
            onChange={(e) => salvar({ intervaloAtualizacaoMinutos: Number(e.target.value) })}
          >
            <option value={1}>1 minuto</option>
            <option value={5}>5 minutos</option>
            <option value={15}>15 minutos</option>
            <option value={30}>30 minutos</option>
            <option value={60}>1 hora</option>
          </select>
        </div>

        <div className={estilos.linhaConfig}>
          <div>
            <p className={estilos.rotulo}>Unidade de Temperatura</p>
            <p className={estilos.descricao}>Escolha entre Celsius ou Fahrenheit</p>
          </div>
          <select
            className={estilos.selecao}
            value={configuracoes.unidadeTemperatura}
            onChange={(e) =>
              salvar({ unidadeTemperatura: e.target.value as 'celsius' | 'fahrenheit' })
            }
          >
            <option value='celsius'>Celsius (°C)</option>
            <option value='fahrenheit'>Fahrenheit (°F)</option>
          </select>
        </div>
      </div>

      <div className={estilos.cartao}>
        <h2 className={estilos.tituloCartao}>🌙 Aparência</h2>
        <hr className={estilos.linha} />

        <div className={estilos.linhaConfig}>
          <div>
            <p className={estilos.rotulo}>Modo Escuro</p>
            <p className={estilos.descricao}>Ativa o tema escuro da interface</p>
          </div>
          <button
            className={configuracoes.modoEscuro ? estilos.alternadorAtivo : estilos.alternador}
            onClick={() => salvar({ modoEscuro: !configuracoes.modoEscuro })}
            aria-pressed={configuracoes.modoEscuro}
          >
            <span className={estilos.indicadorAlternador} />
          </button>
        </div>
      </div>
    </div>
  )
}
