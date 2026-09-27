import { Text, StyleSheet, Pressable, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { MaterialIcons } from '@react-native-vector-icons/material-icons'
import { router } from 'expo-router'
import { Cores } from '@/constants/Cores'
import { Fontes } from '@/constants/Fontes'
import { useAutenticacao } from '@/hooks/useAuthenticacao'

interface CabecalhoAppProps {
  titulo: string
}

function obterSaudacao() {
  const hora = new Date().getHours()
  if (hora < 12) return 'Bom dia'
  if (hora < 18) return 'Boa tarde'
  return 'Boa noite'
}

export function CabecalhoApp({ titulo }: CabecalhoAppProps) {

  const { usuarioContexto, deslogar, deslogarContexto } = useAutenticacao()

  const inicial = (usuarioContexto?.nome || usuarioContexto?.email || '?').charAt(0).toUpperCase()

  const sairDaConta = async () => {
    await deslogar()
    await deslogarContexto()
    router.replace('/')
  }

  return (
    <LinearGradient
      colors={[Cores.primaria, Cores.primariaEscura]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={estilos.topo}
    >
      <View style={estilos.topoLinha}>

        <View style={estilos.perfil}>
          <View style={estilos.avatar}>
            <Text style={estilos.avatarTexto}>{inicial}</Text>
          </View>

          <View>
            <Text style={estilos.saudacao}>{obterSaudacao()}</Text>
            <Text style={estilos.nome}>{usuarioContexto?.nome || usuarioContexto?.email}</Text>
          </View>
        </View>

        <Pressable
          onPress={sairDaConta}
          style={estilos.botaoSair}
          android_ripple={{ color: Cores.primariaClara, borderless: true }}
        >
          <MaterialIcons name="logout" size={22} color={Cores.secundariaClara} />
        </Pressable>

      </View>

      <Text style={estilos.tituloTela}>{titulo}</Text>
    </LinearGradient>
  )
}

const estilos = StyleSheet.create({
  topo: {
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    gap: 20,
  },
  topoLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  perfil: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Cores.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarTexto: {
    fontFamily: Fontes.baseBold,
    fontSize: Fontes.medio2,
    color: Cores.secundariaClara,
  },
  saudacao: {
    fontFamily: Fontes.baseRegular,
    fontSize: Fontes.pequeno,
    color: Cores.secundariaClara,
    opacity: 0.75,
  },
  nome: {
    fontFamily: Fontes.baseBold,
    fontSize: Fontes.medio1,
    color: Cores.secundariaClara,
  },

  botaoSair: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tituloTela: {
    fontFamily: Fontes.baseBold,
    fontSize: Fontes.grande1,
    color: Cores.secundariaClara,
    textAlign: 'center',
  },
})