import estilos from './SeletorIntervalo.module.css'
import { INTERVALOS } from '../tipos/Sensor'
import { type IntervaloTempoTipo } from '../tipos/Sensor'

interface SeletorIntervaloProps {
  valor: IntervaloTempoTipo
  aoMudar: (novoValor: IntervaloTempoTipo) => void
}

export function SeletorIntervalo({ valor, aoMudar }: SeletorIntervaloProps) {
  return (
    <div className={estilos.seletor}>
      {INTERVALOS.map((opcao) => (
        <button
          key={opcao.valor}
          className={valor === opcao.valor ? estilos.botaoAtivo : estilos.botao}
          onClick={() => aoMudar(opcao.valor)}
        >
          {opcao.rotulo}
        </button>
      ))}
    </div>
  )
}
