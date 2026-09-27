import {useContext} from 'react'
import {FirebaseError} from 'firebase/app'
import {createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from 'firebase/auth'
import {autenticacao} from '../firebase/FirebaseConexao'
import {AutenticacaoContexto} from '../contextos/AutenticacaoContexto'

export function useAutenticacao(){

  const autenticacaoContexto = useContext(AutenticacaoContexto)

  if (autenticacaoContexto === undefined) {
    throw new Error('Falta o <AutenticacaoProvider> na aplicação!')
  }

  const { usuario, carregando } = autenticacaoContexto

  const criarAutenticacaoUsuario = async (email: string, senha: string): Promise<string> => {
    let retorno = 'sucesso'
    try {

      await createUserWithEmailAndPassword(autenticacao, email, senha)
    } catch (error) {

      if (error instanceof FirebaseError) {

        switch (error.code) {
          case 'auth/email-already-in-use':
            retorno = `E-mail já utilizado por outra conta. ${error.code}`
            break

          default:
            retorno = `Erro na criação da autenticação do usuário! (${error.code}: ${error.message})`
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
      //email e senha condizem com usuário autenticado?
      await signInWithEmailAndPassword(autenticacao, email, senha)
    } catch (error) {

      if (error instanceof FirebaseError) {

        switch (error.code) {
          default:
            retorno = `Erro na autenticação do usuário! (${error.code}: ${error.message})`
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

      if (error instanceof FirebaseError) {

        switch (error.code) {
          default:
            retorno = `Erro ao deslogar o usuário! (${error.code}: ${error.message})`
            break         
        }
      } else {
        retorno = `Erro imprevisto! (${error})`
      }
    }
    return retorno
  }

  return {criarAutenticacaoUsuario, validarUsuario, deslogar, usuario, carregando}
}
