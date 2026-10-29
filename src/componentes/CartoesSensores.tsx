import estilos from './CartoesSensores.module.css'
import { useDadosSensor } from '../hooks/useDadosSensor'
import { FAIXAS_IDEAIS, calcularSeveridade, type SeveridadeParametroTipo } from '../tipos/FaixasIdeais'

// Como cada situação aparece no card (texto e classes de cor do CSS)
const SITUACAO: Record<SeveridadeParametroTipo, { texto: string; classeCartao: string; classeSelo: string }> = {
  ok: { texto: 'ÓTIMO', classeCartao: estilos.cartaoOk, classeSelo: estilos.situacaoOk },
  atencao: { texto: 'ATENÇÃO', classeCartao: estilos.cartaoAtencao, classeSelo: estilos.situacaoAtencao },
  critico: { texto: 'CRÍTICO', classeCartao: estilos.cartaoCritico, classeSelo: estilos.situacaoCritico },
}

// Um item por card: qual parâmetro, o ícone e as cores do ícone e da barra
const CARTOES = [
  { chave: 'nitrogenio', rotulo: 'Nitrogênio (N)', icone: 'N', classeIcone: estilos.icNitrogenio, classeBarra: estilos.corNitrogenio },
  { chave: 'fosforo', rotulo: 'Fósforo (P)', icone: 'P', classeIcone: estilos.icFosforo, classeBarra: estilos.corFosforo },
  { chave: 'potassio', rotulo: 'Potássio (K)', icone: 'K', classeIcone: estilos.icPotassio, classeBarra: estilos.corPotassio },
  { chave: 'temperatura', rotulo: 'Temperatura', icone: 'C°', classeIcone: estilos.icTemperatura, classeBarra: estilos.corTemperatura },
  { chave: 'umidade', rotulo: 'Umidade', icone: 'H₂O', classeIcone: estilos.icUmidade, classeBarra: estilos.corUmidade },
  { chave: 'ph', rotulo: 'pH do Solo', icone: 'pH', classeIcone: estilos.icPh, classeBarra: estilos.corPh },
  { chave: 'condutividade', rotulo: 'Condutividade (EC)', icone: 'EC', classeIcone: estilos.icCondutividade, classeBarra: estilos.corCondutividade },
] as const

function calcularPorcentagem(valor: number, min: number, max: number): number {
  const porcentagem = ((valor - min) / (max - min)) * 100
  return Math.min(100, Math.max(0, porcentagem))
}

export function CartoesSensores() {
  const { leituraAtual, sensorConectado, carregando, erro } = useDadosSensor()

  if (carregando) {
    return <p className={estilos.mensagemEstado}>Carregando dados do sensor...</p>
  }

  if (erro) {
    return <p className={estilos.mensagemEstado}>Erro ao conectar ao sensor: {erro}</p>
  }

  if (!sensorConectado || !leituraAtual) {
    return (
      <p className={estilos.mensagemEstado}>
        Aguardando conexão do sensor... Os cards aparecem assim que ele estiver ligado e enviando
        leituras.
      </p>
    )
  }

  return (
    <div className={estilos.conteinerGrade}>
      {CARTOES.map((cartao) => {
        const faixa = FAIXAS_IDEAIS.find((f) => f.chave === cartao.chave)
        if (!faixa) return null

        const valor = leituraAtual[cartao.chave]
        const situacao = SITUACAO[calcularSeveridade(valor, faixa)]
        const classeIcone = {ok: estilos.icOk,atencao: estilos.icAtencao,critico: estilos.icCritico,}[calcularSeveridade(valor, faixa)]
        const unidade = faixa.unidade

        return (
          <div key={cartao.chave} className={`${estilos.cartao} ${situacao.classeCartao}`}>
            <div className={estilos.cabecalhoCartao}>
              <div className={`${estilos.icone} ${classeIcone}`}>{cartao.icone}</div>
              <span className={`${estilos.situacao} ${situacao.classeSelo}`}>{situacao.texto}</span>
            </div>

            <p className={estilos.rotulo}>{cartao.rotulo}</p>
            <p className={estilos.valor}>
              {valor.toFixed(1)}
              {unidade && <> <span className={estilos.unidade}>{unidade}</span></>}
            </p>

            <div className={estilos.barraFundo}>
              <div
                className={`${estilos.barraPreenchida} ${cartao.classeBarra}`}
                style={{ width: `${calcularPorcentagem(valor, faixa.min, faixa.max)}%` }}
              />
            </div>
            <div className={estilos.limites}>
              <span>{faixa.min}{unidade}</span>
              <span>{faixa.max}{unidade}</span>
            </div>
            <p className={estilos.faixaIdeal}>
              Faixa ideal: {faixa.min} - {faixa.max}{unidade ? ` ${unidade}` : ''}
            </p>
          </div>
        )
      })}
    </div>
  )
}