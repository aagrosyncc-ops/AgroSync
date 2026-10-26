import { useEffect, useState } from 'react'
import { doc, onSnapshot, setDoc } from 'firebase/firestore'
import { firestore } from '@/servicos/Firebase'
import { CulturaTipo } from '@/tipos/FaixasIdeais'

export function useCultura() {

  const [cultura, setCultura] = useState<CulturaTipo>('padrao')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    const referencia = doc(firestore, 'configuracoes', 'geral')

    const pararDeEscutar = onSnapshot(referencia, (snapshot) => {
      if (snapshot.exists()) {
        const dados = snapshot.data()
        setCultura((dados.cultura as CulturaTipo) ?? 'padrao')
      }
      setCarregando(false)
    })

    return () => pararDeEscutar()
  }, [])

  const salvarCultura = async (novaCultura: CulturaTipo) => {
    const referencia = doc(firestore, 'configuracoes', 'geral')
    await setDoc(referencia, { cultura: novaCultura }, { merge: true })
  }

  return { cultura, carregando, salvarCultura }
}