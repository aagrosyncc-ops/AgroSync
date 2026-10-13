import { useEffect, useState } from 'react'
import { router } from 'expo-router'
import { Text, StyleSheet, View, ActivityIndicator, TextInput, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialIcons } from '@react-native-vector-icons/material-icons'
import { Cores } from '@/constants/Cores'
import { Fontes } from '@/constants/Fontes'
import { useAutenticacao } from '@/hooks/useAuthenticacao'
import { useDadosSensor } from '@/hooks/useDadosSensor'
import { useInfoSensor } from '@/hooks/useInfoSensor'
import { CabecalhoApp } from '@/components/CabecalhoApp'

// se a ultima leitura chegou a menos de 2 minutos, entao esta "conectado"
const TEMPO_LIMITE_OFFLINE_MS = 1 * 60 * 1000

function sensorEstaConectado(timestampUltimaLeitura?: number) {
  if (!timestampUltimaLeitura) {
    return false
  }
  const tempoPassado = Date.now() - timestampUltimaLeitura
  return tempoPassado < TEMPO_LIMITE_OFFLINE_MS
}

export default function sensores() {

  const { usuarioContexto, carregando } = useAutenticacao()
  const { leituraAtual } = useDadosSensor()
  const { infoSensor, salvarInfoSensor } = useInfoSensor()

  const [editando, setEditando] = useState(false)
  const [nomeDigitado, setNomeDigitado] = useState('')
  const [localDigitado, setLocalDigitado] = useState('')

  useEffect(() => {
    if (!carregando && !usuarioContexto) {
      router.replace('/')
    }
  }, [carregando, usuarioContexto])

  const conectado = sensorEstaConectado(leituraAtual?.timestamp)

  function abrirEdicao() {
    setNomeDigitado(infoSensor.nome)
    setLocalDigitado(infoSensor.local)
    setEditando(true)
  }

  async function salvarEdicao() {
    await salvarInfoSensor({ nome: nomeDigitado, local: localDigitado })
    setEditando(false)
  }

  if (carregando || !usuarioContexto) {
    return (
      <SafeAreaView style={estilos.carregandoConteiner}>
        <ActivityIndicator size="large" color={Cores.accent} />
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={estilos.conteiner}>
      <CabecalhoApp titulo="Sensores" />

      <View style={estilos.centroConteudo}>

        <View style={estilos.cartaoSensor}>

          <View style={estilos.cabecalhoCartao}>
            <View style={estilos.statusLinha}>
              <View style={[estilos.bolinhaStatus, { backgroundColor: conectado ? '#2ECC71' : '#E74C3C' }]} />
              <Text style={estilos.textoStatus}>{conectado ? 'Conectado' : 'Desconectado'}</Text>
            </View>

            {!editando && (
              <Pressable onPress={abrirEdicao}>
                <MaterialIcons name="edit" size={30} color={Cores.primariaEscura} />
              </Pressable>
            )}
          </View>

          {editando ? (
            <View style={estilos.formularioEdicao}>
              <Text style={estilos.rotuloCampo}>Nome do sensor</Text>
              <TextInput
                style={estilos.campoTexto}
                value={nomeDigitado}
                onChangeText={setNomeDigitado}
                placeholder="Ex: Sensor Horta 1"
              />

              <Text style={estilos.rotuloCampo}>Local instalado</Text>
              <TextInput
                style={estilos.campoTexto}
                value={localDigitado}
                onChangeText={setLocalDigitado}
                placeholder="Ex: Canteiro A"
              />

              <View style={estilos.botoesEdicao}>
                <Pressable style={estilos.botaoCancelar} onPress={() => setEditando(false)}>
                  <Text style={estilos.textoBotaoCancelar}>Cancelar</Text>
                </Pressable>
                <Pressable style={estilos.botaoSalvar} onPress={salvarEdicao}>
                  <Text style={estilos.textoBotaoSalvar}>Salvar</Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <View>
              <Text style={estilos.nomeSensor}>{infoSensor.nome}</Text>
              <Text style={estilos.localSensor}>{infoSensor.local}</Text>
            </View>
          )}

        </View>

      </View>
    </SafeAreaView>
  )
}

const estilos = StyleSheet.create({
  conteiner: {
    flex: 1,
    backgroundColor: Cores.secundariaEscura
  },

  carregandoConteiner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Cores.secundariaEscura,
  },

  centroConteudo: {
    flex: 1,
    padding: 15
  },

  cartaoSensor: {
    backgroundColor: Cores.secundaria,
    borderRadius: 12,
    padding: 10,
    gap: 20,
  },

  cabecalhoCartao: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  statusLinha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  bolinhaStatus: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },

  textoStatus: {
    fontFamily: Fontes.baseBold,
    fontSize: Fontes.pequeno,
    color: Cores.primariaEscura,
  },

  nomeSensor: {
    fontFamily: Fontes.baseBold,
    fontSize: Fontes.medio2,
    color: Cores.primariaEscura,
  },

  localSensor: {
    fontFamily: Fontes.baseRegular,
    fontSize: Fontes.medio1,
    color: '#666',
  },

  formularioEdicao: {
    gap: 6,
  },

  rotuloCampo: {
    fontFamily: Fontes.baseBold,
    fontSize: Fontes.pequeno,
    color: Cores.primariaEscura,
  },

  campoTexto: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontFamily: Fontes.baseRegular,
    fontSize: Fontes.medio1,
    color: Cores.primariaEscura,
  },

  botoesEdicao: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 6,
  },

  botaoCancelar: {
    paddingVertical: 8,
    paddingHorizontal: 14,
  },

  textoBotaoCancelar: {
    fontFamily: Fontes.baseBold,
    fontSize: Fontes.medio1,
    color: '#888',
  },

  botaoSalvar: {
    backgroundColor: Cores.accent,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },

  textoBotaoSalvar: {
    fontFamily: Fontes.baseBold,
    fontSize: Fontes.medio1,
    color: Cores.secundariaClara,
  },
})