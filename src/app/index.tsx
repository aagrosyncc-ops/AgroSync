import { useState } from 'react'
import { router } from 'expo-router'
import { Text, StyleSheet, TextInput, Pressable, View, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialIcons } from '@react-native-vector-icons/material-icons'
import { UsuarioTipo } from '@/tipos/Usuario'
import { Cores } from '@/constants/Cores'
import { Fontes } from '@/constants/Fontes'
import { useAutenticacao } from '@/hooks/useAuthenticacao'
import { autenticacao } from '@/servicos/Firebase'


export default function index() {

  const [usuario, setUsuario] = useState<UsuarioTipo>(
    { codigo: '', nome: '', email: '', senha: '', permissao: 'usuario' }
  )
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [carregando, setCarregando] = useState(false)

  const { validarUsuario, logarContexto } = useAutenticacao()

  const verificarLogin = async () => {
    if (!usuario.email || !usuario.senha) {
      Alert.alert('Campos obrigatórios', 'Por favor, informe um e-mail e senha.')
      return
    }

    setCarregando(true)
    const retorno = await validarUsuario(usuario.email, usuario.senha)
    setCarregando(false)

    if (retorno === 'sucesso') {
      // depois de validar, o firebase ja tem o usuário logado internamente

      const usuarioFirebase = autenticacao.currentUser

      const usuarioCompleto: UsuarioTipo = {
        ...usuario,
        nome: usuarioFirebase?.displayName ?? '',
      }

      await logarContexto(usuarioCompleto)
      router.replace('/dashboard' as any)
    } else {
      Alert.alert('Falha de autenticação', retorno)
    }
  }
  const abrirCadastro = () => {
    router.push('/cadastro' as any)
  }

  return (
    <SafeAreaView style={estilos.conteiner}>
      <KeyboardAvoidingView
        style={estilos.teclado}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={estilos.scroll}
          keyboardShouldPersistTaps="handled"
        >

          <View style={estilos.logoWrapper}>
            <MaterialIcons name="eco" size={Fontes.extraGrande} color={Cores.secundariaClara} />
          </View>

          <Text style={estilos.titulo}>Agro Sync</Text>
          <Text style={estilos.subtitulo}>Entre com suas credenciais para acessar o dashboard</Text>

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

          <Pressable
            style={estilos.botao}
            android_ripple={{ color: Cores.primariaClara }}
            onPress={verificarLogin}
            disabled={carregando}
          >
            <Text style={estilos.rotulo}>{carregando ? 'Entrando...' : 'Entrar'}</Text>
          </Pressable>

          <Text style={estilos.linhaCadastro}>
            Não tem uma conta?{' '}
            <Text style={estilos.linkCadastro} onPress={abrirCadastro}>
              Cadastre-se
            </Text>
          </Text>

          <Pressable onPress={() => router.push('/sobre' as any)} style={{ marginTop: 14 }}>
            <Text style={estilos.linkSobre}>Sobre o Agro Sync</Text>
          </Pressable>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const estilos = StyleSheet.create({
  conteiner: {
    flex: 1,
    backgroundColor: Cores.primaria,
  },
  teclado: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
    gap: 6,
  },
  logoWrapper: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Cores.primariaEscura,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  titulo: {
    fontFamily: Fontes.baseBold,
    fontSize: Fontes.extraGrande,
    color: Cores.secundariaClara,
  },
  subtitulo: {
    fontFamily: Fontes.baseRegular,
    fontSize: Fontes.medio1,
    color: Cores.secundariaClara,
    opacity: 0.85,
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
    marginVertical: 6,
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
    top: 12,
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
    fontSize: Fontes.medio2,
  },
  linhaCadastro: {
    marginTop: 20,
    color: Cores.secundariaClara,
    fontFamily: Fontes.baseRegular,
    fontSize: Fontes.pequeno,
    textAlign: 'center',
  },
  linkCadastro: {
    color: Cores.accent,
    fontFamily: Fontes.baseBold,
    textDecorationLine: 'underline',
  },

  linkSobre: {
    color: Cores.secundariaClara,
    fontFamily: Fontes.baseRegular,
    fontSize: Fontes.medio1,
    opacity: 0.6,
    textAlign: 'center',
  },
})