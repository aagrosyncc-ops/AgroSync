import { useState } from 'react'
import { router } from 'expo-router'
import { Text, StyleSheet, TextInput, Pressable, View, Alert, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialIcons } from '@react-native-vector-icons/material-icons'
import { UsuarioTipo } from '@/tipos/Usuario'
import { Cores } from '@/constants/Cores'
import { Fontes } from '@/constants/Fontes'
import { useAutenticacao } from '@/hooks/useAuthenticacao'

export default function cadastro() {

  const [usuario, setUsuario] = useState<UsuarioTipo>(
    { codigo: '', nome: '', email: '', senha: '', permissao: 'usuario' }
  )
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [carregando, setCarregando] = useState(false)

  const { criarAutenticacaoUsuario, logarContexto } = useAutenticacao()

  const validar = () => {
    if (usuario.nome.trim().length < 3) {
      Alert.alert('Nome inválido', 'O nome deve ter no mínimo 3 caracteres.')
      return false
    }
    if (!usuario.email.includes('@') || !usuario.email.includes('.')) {
      Alert.alert('E-mail inválido', 'Informe um e-mail válido.')
      return false
    }
    if (usuario.senha.length < 6) {
      Alert.alert('Senha muito curta', 'Use pelo menos 6 caracteres.')
      return false
    }
    if (usuario.senha !== confirmarSenha) {
      Alert.alert('Senhas diferentes', 'As senhas não coincidem.')
      return false
    }
    return true
  }

  const criarConta = async () => {
    if (!validar()) return

    setCarregando(true)

    const retorno = await criarAutenticacaoUsuario(usuario.nome, usuario.email, usuario.senha)

    setCarregando(false)

    if (retorno === 'sucesso') {
      await logarContexto(usuario)
      router.replace('/dashboard' as any)
    } else {
      Alert.alert('Erro ao cadastrar', retorno)
    }
  }

  const voltarLogin = () => {
    router.back()
  }

  return (
    <SafeAreaView style={estilos.conteiner}>
      <ScrollView contentContainerStyle={estilos.scroll}>

        <Pressable onPress={voltarLogin} style={estilos.botaoVoltar}>
          <MaterialIcons name="arrow-back" size={Fontes.grande1} color={Cores.secundariaClara} />
        </Pressable>

        <Text style={estilos.titulo}>Não tem uma conta?</Text>
        <Text style={estilos.titulo2}>crie uma!</Text>

        <TextInput
          style={estilos.campo}
          placeholder="Nome Completo"
          placeholderTextColor={Cores.secundariaClara}
          value={usuario.nome}
          onChangeText={(valor) => setUsuario({ ...usuario, nome: valor })}
        />

        <TextInput
          style={estilos.campo}
          placeholder="E-mail"
          placeholderTextColor={Cores.secundariaClara}
          keyboardType="email-address"
          autoCapitalize="none"
          value={usuario.email}
          onChangeText={(valor) => setUsuario({ ...usuario, email: valor })}
        />

        <View style={estilos.campoSenhaWrapper}>
          <TextInput
            style={estilos.campoSenha}
            placeholder="Senha"
            placeholderTextColor={Cores.secundariaClara}
            secureTextEntry={!mostrarSenha}
            value={usuario.senha}
            onChangeText={(valor) => setUsuario({ ...usuario, senha: valor })}
          />
          <Pressable onPress={() => setMostrarSenha(!mostrarSenha)} style={estilos.olhoSenha}>
            <MaterialIcons
              name={mostrarSenha ? 'visibility' : 'visibility-off'}
              size={Fontes.grande1}
              color={Cores.secundariaClara}
            />
          </Pressable>
        </View>

        <TextInput
          style={estilos.campo}
          placeholder="Confirmar senha"
          placeholderTextColor={Cores.secundariaClara}
          secureTextEntry={!mostrarSenha}
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
        />

        <Pressable
          style={estilos.botao}
          android_ripple={{ color: Cores.primariaClara }}
          onPress={criarConta}
          disabled={carregando}
        >
          <Text style={estilos.rotulo}>{carregando ? 'Cadastrando...' : 'Cadastrar'}</Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  )
}

const estilos = StyleSheet.create({
  conteiner: {
    flex: 1,
    backgroundColor: Cores.primaria
  },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 6,
  },
  botaoVoltar: {
    alignSelf: 'flex-start',
    marginBottom: 10
  },
  titulo: {
    fontFamily: Fontes.baseBold,
    fontSize: Fontes.medio2,
    color: Cores.secundariaClara,
    textAlign: 'center',
    marginBottom: -22,
  },

  titulo2: {
    fontFamily: Fontes.baseBold,
    fontSize: Fontes.extraGrande,
    color: Cores.secundariaClara,
    textAlign: 'center',
    marginBottom: 20,
  },

  campo: {
    backgroundColor: Cores.primariaEscura,
    color: Cores.secundariaClara,
    fontFamily: Fontes.baseRegular,
    fontSize: Fontes.medio1,
    height: 50,
    width: '100%',
    maxWidth: 320,
    marginVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  campoSenhaWrapper: {
    width: '100%',
    maxWidth: 320,
    marginVertical: 6
  },
  campoSenha: {
    backgroundColor: Cores.primariaEscura,
    color: Cores.secundariaClara,
    fontFamily: Fontes.baseRegular,
    fontSize: Fontes.medio1,
    height: 50,
    paddingHorizontal: 15,
    paddingRight: 45,
    borderRadius: 5,
  },
  olhoSenha: {
    position: 'absolute',
    right: 12,
    top: 12
  },
  botao: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Cores.accent,
    height: 50,
    width: '100%',
    maxWidth: 320,
    borderRadius: 5,
    marginTop: 16,
    gap: 10,
  },
  rotulo: {
    color: Cores.secundariaClara,
    fontFamily: Fontes.baseBold,
    fontSize: Fontes.medio2
  },
})