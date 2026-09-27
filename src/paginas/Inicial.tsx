import estilos from './Inicial.module.css'
import { useState } from 'react'
import { useAutenticacao } from '../hooks/useAutenticacao'
import { CartoesSensores } from '../componentes/CartoesSensores'
import { GraficosSensores } from '../componentes/GraficosSensores'

export function Inicial() {
  const { usuario } = useAutenticacao()
  const [aba, setAba] = useState<'cards' | 'graficos'>('cards')

  return (
    <div className={estilos.conteiner} aria-label={`Painel de ${usuario?.email}`}>
      <div className={estilos.cabecalho}>
        <div>
          <h1 className={estilos.titulo}>Dashboard</h1>
          <p className={estilos.subtitulo}>Monitoramento em tempo real do solo</p>
        </div>

        <div className={estilos.botoesAba}>
          <button
            className={aba === 'cards' ? estilos.botaoAtivo : estilos.botao}
            onClick={() => setAba('cards')}
          >
            Cards
          </button>
          <button
            className={aba === 'graficos' ? estilos.botaoAtivo : estilos.botao}
            onClick={() => setAba('graficos')}
          >
            Gráficos
          </button>
        </div>
      </div>

      <section>{aba === 'cards' ? <CartoesSensores /> : <GraficosSensores />}</section>
    </div>
  )
}
