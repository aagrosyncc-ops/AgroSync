import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { MaterialIcons } from '@react-native-vector-icons/material-icons'
import { useDadosSensor } from '@/hooks/useDadosSensor'
import { FAIXAS_POR_CULTURA } from '@/tipos/FaixasIdeais'
import { useCultura } from '@/hooks/useCultura'
import { Cores } from '@/constants/Cores'
import { Fontes } from '@/constants/Fontes'



export function ListaAlertas() {

  const { leituraAtual, carregando, erro } = useDadosSensor()

    const { cultura } = useCultura()
  const faixas = FAIXAS_POR_CULTURA[cultura]

  function obterFaixa(chave: string) {
    return faixas.find((faixa) => faixa.chave === chave)!
  }

  const FAIXA_NITROGENIO = obterFaixa('nitrogenio')
  const FAIXA_FOSFORO = obterFaixa('fosforo')
  const FAIXA_POTASSIO = obterFaixa('potassio')
  const FAIXA_TEMPERATURA = obterFaixa('temperatura')
  const FAIXA_UMIDADE = obterFaixa('umidade')
  const FAIXA_PH = obterFaixa('ph')
  const FAIXA_CONDUTIVIDADE = obterFaixa('condutividade')
  const FAIXA_LUMINOSIDADE = obterFaixa('luminosidade')

  if (carregando) {
    return <Text style={estilos.mensagemEstado}>Carregando alertas...</Text>
  }

  if (erro) {
    return <Text style={estilos.mensagemEstado}>Erro ao conectar ao sensor: {erro}</Text>
  }

  if (!leituraAtual) {
    return (
      <Text style={estilos.mensagemEstado}>
        Nenhuma leitura do sensor disponível ainda.
      </Text>
    )
  }

  // lista de avisos, começa vazia
  const alertas: string[] = []

  // aqui começa a verificacao das faixas para criar os cards
  if (leituraAtual.nitrogenio < FAIXA_NITROGENIO.min || leituraAtual.nitrogenio > FAIXA_NITROGENIO.max) {
    alertas.push('Nitrogênio fora do ideal: ' + leituraAtual.nitrogenio.toFixed(1) + ' mg/kg (ideal: ' + FAIXA_NITROGENIO.min + ' - ' + FAIXA_NITROGENIO.max + ')')
  }

  if (leituraAtual.fosforo < FAIXA_FOSFORO.min || leituraAtual.fosforo > FAIXA_FOSFORO.max) {
    alertas.push('Fósforo fora do ideal: ' + leituraAtual.fosforo.toFixed(1) + ' mg/kg (ideal: ' + FAIXA_FOSFORO.min + ' - ' + FAIXA_FOSFORO.max + ')')
  }

  if (leituraAtual.potassio < FAIXA_POTASSIO.min || leituraAtual.potassio > FAIXA_POTASSIO.max) {
    alertas.push('Potássio fora do ideal: ' + leituraAtual.potassio.toFixed(1) + ' mg/kg (ideal: ' + FAIXA_POTASSIO.min + ' - ' + FAIXA_POTASSIO.max + ')')
  }

  if (leituraAtual.temperatura < FAIXA_TEMPERATURA.min || leituraAtual.temperatura > FAIXA_TEMPERATURA.max) {
    alertas.push('Temperatura fora do ideal: ' + leituraAtual.temperatura.toFixed(1) + ' °C (ideal: ' + FAIXA_TEMPERATURA.min + ' - ' + FAIXA_TEMPERATURA.max + ')')
  }

  if (leituraAtual.umidade < FAIXA_UMIDADE.min || leituraAtual.umidade > FAIXA_UMIDADE.max) {
    alertas.push('Umidade fora do ideal: ' + leituraAtual.umidade.toFixed(1) + ' % (ideal: ' + FAIXA_UMIDADE.min + ' - ' + FAIXA_UMIDADE.max + ')')
  }

  if (leituraAtual.ph < FAIXA_PH.min || leituraAtual.ph > FAIXA_PH.max) {
    alertas.push('pH do solo fora do ideal: ' + leituraAtual.ph.toFixed(1) + ' (ideal: ' + FAIXA_PH.min + ' - ' + FAIXA_PH.max + ')')
  }

  if (leituraAtual.condutividade < FAIXA_CONDUTIVIDADE.min || leituraAtual.condutividade > FAIXA_CONDUTIVIDADE.max) {
    alertas.push('Condutividade fora do ideal: ' + leituraAtual.condutividade.toFixed(1) + ' µS/cm (ideal: ' + FAIXA_CONDUTIVIDADE.min + ' - ' + FAIXA_CONDUTIVIDADE.max + ')')
  }

  if (leituraAtual.luminosidade < FAIXA_LUMINOSIDADE.min || leituraAtual.luminosidade > FAIXA_LUMINOSIDADE.max) {
    alertas.push('Luminosidade fora do ideal: ' + leituraAtual.luminosidade.toFixed(1) + ' lux (ideal: ' + FAIXA_LUMINOSIDADE.min + ' - ' + FAIXA_LUMINOSIDADE.max + ')')
  }

  // a quantos minutos o sensor mandou o ultimo dado
  const minutos = Math.floor((Date.now() - leituraAtual.timestamp) / 60000)

    return (
    <ScrollView contentContainerStyle={estilos.conteudo}>

      <Text style={estilos.ultimaLeitura}>Última leitura: há {minutos} min</Text>

      {alertas.length === 0 && (
        <View style={estilos.cartao}>
          <MaterialIcons name="check-circle" size={28} color={Cores.accent} />
          <Text style={estilos.textoAlerta}>Tudo certo! Todos os valores estão dentro do ideal.</Text>
        </View>
      )}

      {alertas.map((alerta) => (
        <View key={alerta} style={estilos.cartao}>
          <MaterialIcons name="warning" size={28} color="#F39C12" />
          <Text style={estilos.textoAlerta}>{alerta}</Text>
        </View>
      ))}

    </ScrollView>
  )
}

const estilos = StyleSheet.create({
  conteudo: {
    padding: 16,
    gap: 12,
  },
  mensagemEstado: {
    padding: 24,
    textAlign: 'center',
    fontFamily: Fontes.baseRegular,
    fontSize: Fontes.medio1,
    color: Cores.secundariaClara,
  },
  ultimaLeitura: {
    fontFamily: Fontes.baseRegular,
    fontSize: Fontes.pequeno,
    color: Cores.secundariaClara,
    opacity: 0.7,
  },
  cartao: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Cores.secundaria,
    borderRadius: 12,
    padding: 16,
  },
  textoAlerta: {
    flex: 1,
    fontFamily: Fontes.baseRegular,
    fontSize: Fontes.pequeno,
    color: Cores.primariaEscura,
  },
})