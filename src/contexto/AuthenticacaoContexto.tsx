import { createContext, useState, useEffect, ReactNode } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { UsuarioTipo } from '@/tipos/Usuario'

interface AutenticacaoContextoObjeto {
  usuarioContexto: UsuarioTipo | null
  carregando: boolean
  logarContexto: (dadosUsuario: UsuarioTipo) => Promise<void>
  deslogarContexto: () => Promise<void>
}

export const AutenticacaoContexto = createContext<AutenticacaoContextoObjeto | undefined>(undefined)

export function AutenticacaoProvider({ children }: { children: ReactNode }) {

  const [usuarioContexto, setUsuarioContexto] = useState<UsuarioTipo | null>(null)
  const [carregando, setCarregando] = useState(true)

  // roda uma vez ao abrir o app: tenta recuperar uma sessao salvaa
  useEffect(() => {
    async function carregarSessaoSalva() {
      try {
        const sessaoSalva = await AsyncStorage.getItem('@AgroSync:usuario')
        if (sessaoSalva) {
          setUsuarioContexto(JSON.parse(sessaoSalva))
        }
      } catch (error) {
        console.log('Erro ao carregar dados do AsyncStorage:', error)
      } finally {
    
        setCarregando(false)
      }
    }

    carregarSessaoSalva()
  }, [])

  const logarContexto = async (dadosUsuario: UsuarioTipo) => {
    try {
      setUsuarioContexto(dadosUsuario)
      await AsyncStorage.setItem('@AgroSync:usuario', JSON.stringify(dadosUsuario))
    } catch (error) {
      console.log('Erro ao salvar dados no AsyncStorage:', error)
    }
  }

  const deslogarContexto = async () => {
    try {
      setUsuarioContexto(null)
      await AsyncStorage.removeItem('@AgroSync:usuario')
    } catch (error) {
      console.log('Erro ao remover dados do AsyncStorage:', error)
    }
  }

  return (
    <AutenticacaoContexto.Provider value={{ usuarioContexto, carregando, logarContexto, deslogarContexto }}>
      {children}
    </AutenticacaoContexto.Provider>
  )
}