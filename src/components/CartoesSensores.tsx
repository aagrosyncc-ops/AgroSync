import { View, Text, StyleSheet, ScrollView, DimensionValue } from 'react-native'
import { useDadosSensor } from '@/hooks/useDadosSensor'
import { faixas_ideias } from '@/tipos/FaixasIdeais'
import { Cores } from '@/constants/Cores'
import { Fontes } from '@/constants/Fontes'

function obterFaixa(chave: string) {
  return faixas_ideias.find((faixa) => faixa.chave === chave)!
}

function calcularStatus(valor: number, min: number, max: number) {
  if (valor >= min && valor <= max) {
    return 'ÓTIMO'
  } else {
    return 'ATENÇÃO'
  }
}

function calcularPorcentagem(valor: number, min: number, max: number) {
  let porcentagem = ((valor - min) / (max - min)) * 100

  if (porcentagem > 100) {
    porcentagem = 100
  }
  if (porcentagem < 0) {
    porcentagem = 0
  }

  return porcentagem
}

const FAIXA_NITROGENIO = obterFaixa('nitrogenio')
const FAIXA_FOSFORO = obterFaixa('fosforo')
const FAIXA_POTASSIO = obterFaixa('potassio')
const FAIXA_TEMPERATURA = obterFaixa('temperatura')
const FAIXA_UMIDADE = obterFaixa('umidade')
const FAIXA_PH = obterFaixa('ph')
const FAIXA_CONDUTIVIDADE = obterFaixa('condutividade')
const FAIXA_LUMINOSIDADE = obterFaixa('luminosidade')

export function CartoesSensores() {

  const { leituraAtual, carregando, erro } = useDadosSensor()

  if (carregando) {
    return <Text style={estilos.mensagemEstado}>Carregando dados do sensor...</Text>
  }

  if (erro) {
    return <Text style={estilos.mensagemEstado}>Erro ao conectar ao sensor: {erro}</Text>
  }

  if (!leituraAtual) {
    return (
      <Text style={estilos.mensagemEstado}>
        Aguardando conexão com o sensor. Verifique se o ESP32 está em funcionamento para
         que os dados sejam exibidos.
      </Text>
    )
  }

  return (
    <ScrollView contentContainerStyle={estilos.conteinerGrade}>

      {/* card nitrogenio */}
      <View style={estilos.cartao}>
        <View style={estilos.cabecalhoCartao}>
          <Text style={estilos.rotulo}>Nitrogênio (N)</Text>
          <Text style={estilos.situacao}>
            {calcularStatus(leituraAtual.nitrogenio, FAIXA_NITROGENIO.min, FAIXA_NITROGENIO.max)}
          </Text>
        </View>
        <Text style={estilos.valor}>{leituraAtual.nitrogenio.toFixed(1)} <Text style={estilos.unidade}>mg/kg</Text></Text>
        <View style={estilos.barraFundo}>
          <View style={[estilos.barraPreenchida, { width: (calcularPorcentagem(leituraAtual.nitrogenio, FAIXA_NITROGENIO.min, FAIXA_NITROGENIO.max) + '%') as DimensionValue}]} />
        </View>
        <Text style={estilos.faixaIdeal}>Faixa ideal: {FAIXA_NITROGENIO.min} - {FAIXA_NITROGENIO.max} mg/kg</Text>
      </View>

      {/* card fosforo */}
      <View style={estilos.cartao}>
        <View style={estilos.cabecalhoCartao}>
          <Text style={estilos.rotulo}>Fósforo (P)</Text>
          <Text style={estilos.situacao}>
            {calcularStatus(leituraAtual.fosforo, FAIXA_FOSFORO.min, FAIXA_FOSFORO.max)}
          </Text>
        </View>
        <Text style={estilos.valor}>{leituraAtual.fosforo.toFixed(1)} <Text style={estilos.unidade}>mg/kg</Text></Text>
        <View style={estilos.barraFundo}>
          <View style={[estilos.barraPreenchida, { width: (calcularPorcentagem(leituraAtual.fosforo, FAIXA_FOSFORO.min, FAIXA_FOSFORO.max) + '%') as DimensionValue}]} />
        </View>
        <Text style={estilos.faixaIdeal}>Faixa ideal: {FAIXA_FOSFORO.min} - {FAIXA_FOSFORO.max} mg/kg</Text>
      </View>

      {/* card potassio */}
      <View style={estilos.cartao}>
        <View style={estilos.cabecalhoCartao}>
          <Text style={estilos.rotulo}>Potássio (K)</Text>
          <Text style={estilos.situacao}>
            {calcularStatus(leituraAtual.potassio, FAIXA_POTASSIO.min, FAIXA_POTASSIO.max)}
          </Text>
        </View>
        <Text style={estilos.valor}>{leituraAtual.potassio.toFixed(1)} <Text style={estilos.unidade}>mg/kg</Text></Text>
        <View style={estilos.barraFundo}>
          <View style={[estilos.barraPreenchida, { width: (calcularPorcentagem(leituraAtual.potassio, FAIXA_POTASSIO.min, FAIXA_POTASSIO.max) + '%') as DimensionValue}]} />
        </View>
        <Text style={estilos.faixaIdeal}>Faixa ideal: {FAIXA_POTASSIO.min} - {FAIXA_POTASSIO.max} mg/kg</Text>
      </View>

      {/* card temperatura */}
      <View style={estilos.cartao}>
        <View style={estilos.cabecalhoCartao}>
          <Text style={estilos.rotulo}>Temperatura</Text>
          <Text style={estilos.situacao}>
            {calcularStatus(leituraAtual.temperatura, FAIXA_TEMPERATURA.min, FAIXA_TEMPERATURA.max)}
          </Text>
        </View>
        <Text style={estilos.valor}>{leituraAtual.temperatura.toFixed(1)} <Text style={estilos.unidade}>°C</Text></Text>
        <View style={estilos.barraFundo}>
          <View style={[estilos.barraPreenchida, { width: (calcularPorcentagem(leituraAtual.temperatura, FAIXA_TEMPERATURA.min, FAIXA_TEMPERATURA.max) + '%') as DimensionValue}]} />
        </View>
        <Text style={estilos.faixaIdeal}>Faixa ideal: {FAIXA_TEMPERATURA.min} - {FAIXA_TEMPERATURA.max} °C</Text>
      </View>

      {/* card umidade */}
      <View style={estilos.cartao}>
        <View style={estilos.cabecalhoCartao}>
          <Text style={estilos.rotulo}>Umidade</Text>
          <Text style={estilos.situacao}>
            {calcularStatus(leituraAtual.umidade, FAIXA_UMIDADE.min, FAIXA_UMIDADE.max)}
          </Text>
        </View>
        <Text style={estilos.valor}>{leituraAtual.umidade.toFixed(1)} <Text style={estilos.unidade}>%</Text></Text>
        <View style={estilos.barraFundo}>
          <View style={[estilos.barraPreenchida, { width: (calcularPorcentagem(leituraAtual.umidade, FAIXA_UMIDADE.min, FAIXA_UMIDADE.max) + '%') as DimensionValue}]} />
        </View>
        <Text style={estilos.faixaIdeal}>Faixa ideal: {FAIXA_UMIDADE.min} - {FAIXA_UMIDADE.max} %</Text>
      </View>

      {/* card ph */}
      <View style={estilos.cartao}>
        <View style={estilos.cabecalhoCartao}>
          <Text style={estilos.rotulo}>pH do Solo</Text>
          <Text style={estilos.situacao}>
            {calcularStatus(leituraAtual.ph, FAIXA_PH.min, FAIXA_PH.max)}
          </Text>
        </View>
        <Text style={estilos.valor}>{leituraAtual.ph.toFixed(1)}</Text>
        <View style={estilos.barraFundo}>
          <View style={[estilos.barraPreenchida, { width: (calcularPorcentagem(leituraAtual.ph, FAIXA_PH.min, FAIXA_PH.max) + '%') as DimensionValue}]} />
        </View>
        <Text style={estilos.faixaIdeal}>Faixa ideal: {FAIXA_PH.min} - {FAIXA_PH.max}</Text>
      </View>

      {/* card condutividade */}
      <View style={estilos.cartao}>
        <View style={estilos.cabecalhoCartao}>
          <Text style={estilos.rotulo}>Condutividade (EC)</Text>
          <Text style={estilos.situacao}>
            {calcularStatus(leituraAtual.condutividade, FAIXA_CONDUTIVIDADE.min, FAIXA_CONDUTIVIDADE.max)}
          </Text>
        </View>
        <Text style={estilos.valor}>{leituraAtual.condutividade.toFixed(1)} <Text style={estilos.unidade}>µS/cm</Text></Text>
        <View style={estilos.barraFundo}>
          <View style={[estilos.barraPreenchida, { width: (calcularPorcentagem(leituraAtual.condutividade, FAIXA_CONDUTIVIDADE.min, FAIXA_CONDUTIVIDADE.max) + '%') as DimensionValue}]} />
        </View>
        <Text style={estilos.faixaIdeal}>Faixa ideal: {FAIXA_CONDUTIVIDADE.min} - {FAIXA_CONDUTIVIDADE.max} µS/cm</Text>
      </View>

      {/* card luminosidade */}
      <View style={estilos.cartao}>
        <View style={estilos.cabecalhoCartao}>
          <Text style={estilos.rotulo}>Luminosidade</Text>
          <Text style={estilos.situacao}>
            {calcularStatus(leituraAtual.luminosidade, FAIXA_LUMINOSIDADE.min, FAIXA_LUMINOSIDADE.max)}
          </Text>
        </View>
        <Text style={estilos.valor}>{leituraAtual.luminosidade.toFixed(1)} <Text style={estilos.unidade}>lux</Text></Text>
        <View style={estilos.barraFundo}>
          <View style={[estilos.barraPreenchida, { width: (calcularPorcentagem(leituraAtual.luminosidade, FAIXA_LUMINOSIDADE.min, FAIXA_LUMINOSIDADE.max) + '%') as DimensionValue}]} />
        </View>
        <Text style={estilos.faixaIdeal}>Faixa ideal: {FAIXA_LUMINOSIDADE.min} - {FAIXA_LUMINOSIDADE.max} lux</Text>
      </View>

    </ScrollView>
  )
}

const estilos = StyleSheet.create({
  conteinerGrade: {
    padding: 16,
    gap: 12,
  },
  cartao: {
    backgroundColor: Cores.secundaria,
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  cabecalhoCartao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rotulo: {
    fontFamily: Fontes.baseBold,
    fontSize: Fontes.medio1,
    color: Cores.primariaEscura,
  },
  situacao: {
    fontFamily: Fontes.baseBold,
    fontSize: Fontes.pequeno,
    color: Cores.accent,
  },
  valor: {
    fontFamily: Fontes.baseBold,
    fontSize: Fontes.grande1,
    color: Cores.primariaEscura,
  },
  unidade: {
    fontFamily: Fontes.baseRegular,
    fontSize: Fontes.medio1,
    color: '#666',
  },
  barraFundo: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
    overflow: 'hidden',
  },
  barraPreenchida: {
    height: '100%',
    backgroundColor: Cores.accent,
    borderRadius: 4,
  },
  faixaIdeal: {
    fontFamily: Fontes.baseRegular,
    fontSize: Fontes.pequeno,
    color: '#666',
  },
  mensagemEstado: {
    padding: 24,
    textAlign: 'center',
    fontFamily: Fontes.baseRegular,
    fontSize: Fontes.medio1,
    color: Cores.secundariaClara,
  },
})