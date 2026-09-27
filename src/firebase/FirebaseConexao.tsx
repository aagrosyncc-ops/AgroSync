import estilos from './FirebaseConexao.module.css'
import {initializeApp, FirebaseError} from 'firebase/app'
import {getAuth} from 'firebase/auth'
import {getDatabase} from 'firebase/database'
import {getFirestore} from 'firebase/firestore'
import {useEffect, useState} from 'react'
import {signInWithEmailAndPassword} from 'firebase/auth'
import { MdError } from 'react-icons/md'

// credencial protegida env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENTID
}

const conexao = initializeApp(firebaseConfig)
const autenticacao = getAuth(conexao)
const bancoDados = getDatabase(conexao)
const firestore = getFirestore(conexao)
export {autenticacao, bancoDados, firestore}


export function FirebaseConexao() {

  const [mensagemErro, setMensagemErro] = useState('Verificando conexão...')
  const [conectado, setConectado] = useState(false)

  const testarConexao = async () => {
    
    try {
     
      await signInWithEmailAndPassword(autenticacao, 'email_invalido@email.com', '123456')

    } catch (error) {

      if (error instanceof FirebaseError) {

        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/invalid-credential':
            setMensagemErro(`Conexão com o Firebase estabelecida com sucesso! ${error.code}`)
            setConectado(true)
            break

          case 'auth/api-key-not-valid.-please-pass-a-valid-api-key.':
            setMensagemErro('Chave de API do Firebase inválida!')
            setConectado(false)    
            break

          case 'auth/network-request-failed':
            setMensagemErro('Falha de rede! Verifique sua internet')
            setConectado(false)
            break

          case 'auth/too-many-requests':
            setMensagemErro('IP bloqueado temporariamente por excesso de tentativas (Aguarde alguns minutos).')
            setConectado(false)     
            break
            
          default:
            setMensagemErro(`Erro imprevisto! ${error.code}`)
            setConectado(false)
            break
        }
      } else {
            setMensagemErro(`Erro imprevisto! (${error})`)
            setConectado(false)
      }

    }
  }

  useEffect(() => {
    testarConexao()
  }, []);

  if (conectado) {
    console.log(mensagemErro)
  } else {
    return (
      <div className={estilos.conteiner}>
        <h1 className={estilos.titulo}>AgroSync</h1>
        <MdError className={estilos.icone} />
        <p className={estilos.mensagem}>{mensagemErro}</p>
      </div>
    )
  }

}