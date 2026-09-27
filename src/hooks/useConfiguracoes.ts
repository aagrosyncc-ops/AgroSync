import { useAutenticacao } from '../hooks/useAutenticacao'
import { useEffect, useState } from 'react'
import { ref, onValue, update } from 'firebase/database'
import { bancoDados } from '../firebase/FirebaseConexao'

import type { ConfiguracoesUsuarioTipo } from '../tipos/Configuracoes'
import { CONFIGURACOES_PADRAO } from '../tipos/Configuracoes'

interface ConfiguracoesHookTipo {
  configuracoes: ConfiguracoesUsuarioTipo
  carregando: boolean
  salvar: (mudancas: Partial<ConfiguracoesUsuarioTipo>) => Promise<void>
}

export function useConfiguracoes(): ConfiguracoesHookTipo {
  const { usuario } = useAutenticacao()
  const [configuracoes, setConfiguracoes] = useState<ConfiguracoesUsuarioTipo>(CONFIGURACOES_PADRAO)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    if (!usuario) {
      return
    }

    const configRef = ref(bancoDados, `usuarios/${usuario.codigo}/configuracoes`)
    const parar = onValue(configRef, (snapshot) => {
      const salvas = snapshot.val() as Partial<ConfiguracoesUsuarioTipo> | null
      setConfiguracoes({ ...CONFIGURACOES_PADRAO, ...salvas })
      setCarregando(false)
    })

    return () => parar()
  }, [usuario])

  async function salvar(mudancas: Partial<ConfiguracoesUsuarioTipo>): Promise<void> {
    if (!usuario) return
    await update(ref(bancoDados, `usuarios/${usuario.codigo}/configuracoes`), mudancas)
  }

  return {
    configuracoes: usuario ? configuracoes : CONFIGURACOES_PADRAO,
    carregando: !!usuario && carregando,
    salvar,
  }
}
