import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'
import { getFirestore } from 'firebase/firestore'

// credencial protegida env
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENTID,
}

const conexao = initializeApp(firebaseConfig)
const autenticacao = getAuth(conexao)
const bancoDados = getDatabase(conexao)
const firestore = getFirestore(conexao)
export { autenticacao, bancoDados, firestore }

/*
  Antes este componente fazia um login falso a cada carregamento da página só para
  "testar a conexão". Isso estourava o limite do Firebase Auth e bloqueava o site
  inteiro ("IP bloqueado por excesso de tentativas"). Agora não faz nenhuma chamada
  e não aparece na tela — fica só para o main.tsx continuar funcionando.
*/
export function FirebaseConexao() {
  return null
}