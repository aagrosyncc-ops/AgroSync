import { useContext } from 'react'
import { FirebaseError } from 'firebase/app'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth'
import { autenticacao } from '@/servicos/Firebase'
import { AutenticacaoContexto } from '@/contexto/AuthenticacaoContexto'

export function useAutenticacao() {

  const autenticacaoContexto = useContext(AutenticacaoContexto)

  if (autenticacaoContexto === undefined) {
    throw new Error('Falta o <AutenticacaoProvider> na aplicação!')
  }

  const { usuarioContexto, carregando, logarContexto, deslogarContexto } = autenticacaoContexto

  const criarAutenticacaoUsuario = async (nome: string, email: string, senha: string): Promise<string> => {
    let retorno = 'sucesso'
    try {
      const credencial = await createUserWithEmailAndPassword(autenticacao, email, senha)
      // grava o nome digitado dentro do proprio usuário do firebase
      await updateProfile(credencial.user, { displayName: nome })
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/email-already-in-use':
            retorno = 'E-mail já utilizado por outra conta.'
            break
          case 'auth/weak-password':
            retorno = 'A senha precisa ter pelo menos 6 caracteres.'
            break
          default:
            retorno = `Erro na criação da conta! (${error.code})`
            break
        }
      } else {
        retorno = `Erro imprevisto! (${error})`
      }
    }
    return retorno
  }

  const validarUsuario = async (email: string, senha: string): Promise<string> => {
    let retorno = 'sucesso'
    try {
      await signInWithEmailAndPassword(autenticacao, email, senha)
    } catch (error) {
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/invalid-credential':
            retorno = 'E-mail ou senha incorretos.'
            break
          default:
            retorno = `Erro na autenticação! (${error.code})`
            break
        }
      } else {
        retorno = `Erro imprevisto! (${error})`
      }
    }
    return retorno
  }

  const deslogar = async (): Promise<string> => {
    let retorno = 'sucesso'
    try {
      await signOut(autenticacao)
    } catch (error) {
      retorno = `Erro ao deslogar! (${error})`
    }
    return retorno
  }

  return { criarAutenticacaoUsuario, validarUsuario, deslogar, logarContexto, deslogarContexto, usuarioContexto, carregando }
}