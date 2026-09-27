import estilos from './CartoesSensores.module.css'
import { useDadosSensor } from '../hooks/useDadosSensor'
import { useConfiguracoes } from '../hooks/useConfiguracoes'
import { celsiusParaFahrenheit } from '../tipos/Configuracoes'
import { FAIXAS_IDEAIS } from '../tipos/FaixasIdeais'

function obterFaixa(chave: string) {
  return FAIXAS_IDEAIS.find((faixa) => faixa.chave === chave)!
}

const FAIXA_NITROGENIO = obterFaixa('nitrogenio')
const FAIXA_FOSFORO = obterFaixa('fosforo')
const FAIXA_POTASSIO = obterFaixa('potassio')
const FAIXA_TEMPERATURA = obterFaixa('temperatura')
const FAIXA_UMIDADE = obterFaixa('umidade')
const FAIXA_PH = obterFaixa('ph')
const FAIXA_CONDUTIVIDADE = obterFaixa('condutividade')
const FAIXA_LUMINOSIDADE = obterFaixa('luminosidade')

function calcularStatus(valor: number, min: number, max: number): 'ÓTIMO' | 'ATENÇÃO' {
  return valor >= min && valor <= max ? 'ÓTIMO' : 'ATENÇÃO'
}

function calcularPorcentagem(valor: number, min: number, max: number): number {
  const porcentagem = ((valor - min) / (max - min)) * 100
  return Math.min(100, Math.max(0, porcentagem))
}

export function CartoesSensores() {
  const { leituraAtual, carregando, erro } = useDadosSensor()
  const { configuracoes } = useConfiguracoes()

  if (carregando) {
    return <p className={estilos.mensagemEstado}>Carregando dados do sensor...</p>
  }

  if (erro) {
    return <p className={estilos.mensagemEstado}>Erro ao conectar ao sensor: {erro}</p>
  }

  if (!leituraAtual) {
    return (
      <p className={estilos.mensagemEstado}>
        Aguardando o sensor enviar dados. Verifique se o ESP32 está gravando leituras
        na coleção "leituras_sensor" do Firestore.
      </p>
    )
  }

  const usaFahrenheit = configuracoes.unidadeTemperatura === 'fahrenheit'
  const temperaturaExibida = usaFahrenheit
    ? celsiusParaFahrenheit(leituraAtual.temperatura)
    : leituraAtual.temperatura
  const unidadeTemperatura = usaFahrenheit ? '°F' : '°C'
  const faixaTemperaturaExibida = usaFahrenheit
    ? {
        min: celsiusParaFahrenheit(FAIXA_TEMPERATURA.min),
        max: celsiusParaFahrenheit(FAIXA_TEMPERATURA.max),
      }
    : FAIXA_TEMPERATURA

  return (
    <div className={estilos.conteinerGrade}>
      <div className={estilos.cartao}>
        <div className={estilos.cabecalhoCartao}>
          <div className={`${estilos.icone} ${estilos.icNitrogenio}`}>N</div>
          <span className={estilos.situacao}>
            {calcularStatus(leituraAtual.nitrogenio, FAIXA_NITROGENIO.min, FAIXA_NITROGENIO.max)}
          </span>
        </div>
        <p className={estilos.rotulo}>Nitrogênio (N)</p>
        <p className={estilos.valor}>
          {leituraAtual.nitrogenio.toFixed(1)} <span className={estilos.unidade}>mg/kg</span>
        </p>
        <div className={estilos.barraFundo}>
          <div
            className={`${estilos.barraPreenchida} ${estilos.corNitrogenio}`}
            style={{
              width: `${calcularPorcentagem(leituraAtual.nitrogenio, FAIXA_NITROGENIO.min, FAIXA_NITROGENIO.max)}%`,
            }}
          />
        </div>
        <div className={estilos.limites}>
          <span>{FAIXA_NITROGENIO.min}mg/kg</span>
          <span>{FAIXA_NITROGENIO.max}mg/kg</span>
        </div>
        <p className={estilos.faixaIdeal}>
          Faixa ideal: {FAIXA_NITROGENIO.min} - {FAIXA_NITROGENIO.max} mg/kg
        </p>
      </div>

      <div className={estilos.cartao}>
        <div className={estilos.cabecalhoCartao}>
          <div className={`${estilos.icone} ${estilos.icFosforo}`}>P</div>
          <span className={estilos.situacao}>
            {calcularStatus(leituraAtual.fosforo, FAIXA_FOSFORO.min, FAIXA_FOSFORO.max)}
          </span>
        </div>
        <p className={estilos.rotulo}>Fósforo (P)</p>
        <p className={estilos.valor}>
          {leituraAtual.fosforo.toFixed(1)} <span className={estilos.unidade}>mg/kg</span>
        </p>
        <div className={estilos.barraFundo}>
          <div
            className={`${estilos.barraPreenchida} ${estilos.corFosforo}`}
            style={{
              width: `${calcularPorcentagem(leituraAtual.fosforo, FAIXA_FOSFORO.min, FAIXA_FOSFORO.max)}%`,
            }}
          />
        </div>
        <div className={estilos.limites}>
          <span>{FAIXA_FOSFORO.min}mg/kg</span>
          <span>{FAIXA_FOSFORO.max}mg/kg</span>
        </div>
        <p className={estilos.faixaIdeal}>
          Faixa ideal: {FAIXA_FOSFORO.min} - {FAIXA_FOSFORO.max} mg/kg
        </p>
      </div>

      <div className={estilos.cartao}>
        <div className={estilos.cabecalhoCartao}>
          <div className={`${estilos.icone} ${estilos.icPotassio}`}>K</div>
          <span className={estilos.situacao}>
            {calcularStatus(leituraAtual.potassio, FAIXA_POTASSIO.min, FAIXA_POTASSIO.max)}
          </span>
        </div>
        <p className={estilos.rotulo}>Potássio (K)</p>
        <p className={estilos.valor}>
          {leituraAtual.potassio.toFixed(1)} <span className={estilos.unidade}>mg/kg</span>
        </p>
        <div className={estilos.barraFundo}>
          <div
            className={`${estilos.barraPreenchida} ${estilos.corPotassio}`}
            style={{
              width: `${calcularPorcentagem(leituraAtual.potassio, FAIXA_POTASSIO.min, FAIXA_POTASSIO.max)}%`,
            }}
          />
        </div>
        <div className={estilos.limites}>
          <span>{FAIXA_POTASSIO.min}mg/kg</span>
          <span>{FAIXA_POTASSIO.max}mg/kg</span>
        </div>
        <p className={estilos.faixaIdeal}>
          Faixa ideal: {FAIXA_POTASSIO.min} - {FAIXA_POTASSIO.max} mg/kg
        </p>
      </div>

      <div className={estilos.cartao}>
        <div className={estilos.cabecalhoCartao}>
          <div className={`${estilos.icone} ${estilos.icTemperatura}`}>°</div>
          <span className={estilos.situacao}>
            {calcularStatus(leituraAtual.temperatura, FAIXA_TEMPERATURA.min, FAIXA_TEMPERATURA.max)}
          </span>
        </div>
        <p className={estilos.rotulo}>Temperatura</p>
        <p className={estilos.valor}>
          {temperaturaExibida.toFixed(1)}{' '}
          <span className={estilos.unidade}>{unidadeTemperatura}</span>
        </p>
        <div className={estilos.barraFundo}>
          <div
            className={`${estilos.barraPreenchida} ${estilos.corTemperatura}`}
            style={{
              width: `${calcularPorcentagem(leituraAtual.temperatura, FAIXA_TEMPERATURA.min, FAIXA_TEMPERATURA.max)}%`,
            }}
          />
        </div>
        <div className={estilos.limites}>
          <span>
            {faixaTemperaturaExibida.min.toFixed(1)}
            {unidadeTemperatura}
          </span>
          <span>
            {faixaTemperaturaExibida.max.toFixed(1)}
            {unidadeTemperatura}
          </span>
        </div>
        <p className={estilos.faixaIdeal}>
          Faixa ideal: {faixaTemperaturaExibida.min.toFixed(1)} -{' '}
          {faixaTemperaturaExibida.max.toFixed(1)} {unidadeTemperatura}
        </p>
      </div>

      <div className={estilos.cartao}>
        <div className={estilos.cabecalhoCartao}>
          <div className={`${estilos.icone} ${estilos.icUmidade}`}>💧</div>
          <span className={estilos.situacao}>
            {calcularStatus(leituraAtual.umidade, FAIXA_UMIDADE.min, FAIXA_UMIDADE.max)}
          </span>
        </div>
        <p className={estilos.rotulo}>Umidade</p>
        <p className={estilos.valor}>
          {leituraAtual.umidade.toFixed(1)} <span className={estilos.unidade}>%</span>
        </p>
        <div className={estilos.barraFundo}>
          <div
            className={`${estilos.barraPreenchida} ${estilos.corUmidade}`}
            style={{
              width: `${calcularPorcentagem(leituraAtual.umidade, FAIXA_UMIDADE.min, FAIXA_UMIDADE.max)}%`,
            }}
          />
        </div>
        <div className={estilos.limites}>
          <span>{FAIXA_UMIDADE.min}%</span>
          <span>{FAIXA_UMIDADE.max}%</span>
        </div>
        <p className={estilos.faixaIdeal}>
          Faixa ideal: {FAIXA_UMIDADE.min} - {FAIXA_UMIDADE.max} %
        </p>
      </div>

      <div className={estilos.cartao}>
        <div className={estilos.cabecalhoCartao}>
          <div className={`${estilos.icone} ${estilos.icPh}`}>pH</div>
          <span className={estilos.situacao}>
            {calcularStatus(leituraAtual.ph, FAIXA_PH.min, FAIXA_PH.max)}
          </span>
        </div>
        <p className={estilos.rotulo}>pH do Solo</p>
        <p className={estilos.valor}>{leituraAtual.ph.toFixed(1)}</p>
        <div className={estilos.barraFundo}>
          <div
            className={`${estilos.barraPreenchida} ${estilos.corPh}`}
            style={{
              width: `${calcularPorcentagem(leituraAtual.ph, FAIXA_PH.min, FAIXA_PH.max)}%`,
            }}
          />
        </div>
        <div className={estilos.limites}>
          <span>{FAIXA_PH.min}</span>
          <span>{FAIXA_PH.max}</span>
        </div>
        <p className={estilos.faixaIdeal}>
          Faixa ideal: {FAIXA_PH.min} - {FAIXA_PH.max}
        </p>
      </div>

      <div className={estilos.cartao}>
        <div className={estilos.cabecalhoCartao}>
          <div className={`${estilos.icone} ${estilos.icCondutividade}`}>EC</div>
          <span className={estilos.situacao}>
            {calcularStatus(leituraAtual.condutividade, FAIXA_CONDUTIVIDADE.min, FAIXA_CONDUTIVIDADE.max)}
          </span>
        </div>
        <p className={estilos.rotulo}>Condutividade (EC)</p>
        <p className={estilos.valor}>
          {leituraAtual.condutividade.toFixed(1)} <span className={estilos.unidade}>µS/cm</span>
        </p>
        <div className={estilos.barraFundo}>
          <div
            className={`${estilos.barraPreenchida} ${estilos.corCondutividade}`}
            style={{
              width: `${calcularPorcentagem(leituraAtual.condutividade, FAIXA_CONDUTIVIDADE.min, FAIXA_CONDUTIVIDADE.max)}%`,
            }}
          />
        </div>
        <div className={estilos.limites}>
          <span>{FAIXA_CONDUTIVIDADE.min}µS/cm</span>
          <span>{FAIXA_CONDUTIVIDADE.max}µS/cm</span>
        </div>
        <p className={estilos.faixaIdeal}>
          Faixa ideal: {FAIXA_CONDUTIVIDADE.min} - {FAIXA_CONDUTIVIDADE.max} µS/cm
        </p>
      </div>

      <div className={estilos.cartao}>
        <div className={estilos.cabecalhoCartao}>
          <div className={`${estilos.icone} ${estilos.icLuminosidade}`}>☀</div>
          <span className={estilos.situacao}>
            {calcularStatus(
              leituraAtual.luminosidade,
              FAIXA_LUMINOSIDADE.min,
              FAIXA_LUMINOSIDADE.max,
            )}
          </span>
        </div>
        <p className={estilos.rotulo}>Luminosidade</p>
        <p className={estilos.valor}>
          {leituraAtual.luminosidade.toFixed(1)} <span className={estilos.unidade}>lux</span>
        </p>
        <div className={estilos.barraFundo}>
          <div
            className={`${estilos.barraPreenchida} ${estilos.corLuminosidade}`}
            style={{
              width: `${calcularPorcentagem(leituraAtual.luminosidade, FAIXA_LUMINOSIDADE.min, FAIXA_LUMINOSIDADE.max)}%`,
            }}
          />
        </div>
        <div className={estilos.limites}>
          <span>{FAIXA_LUMINOSIDADE.min}lux</span>
          <span>{FAIXA_LUMINOSIDADE.max}lux</span>
        </div>
        <p className={estilos.faixaIdeal}>
          Faixa ideal: {FAIXA_LUMINOSIDADE.min} - {FAIXA_LUMINOSIDADE.max} lux
        </p>
      </div>
    </div>
  )
}