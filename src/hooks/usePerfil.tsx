import { useEffect, useState } from 'react'
import { FirebaseError } from 'firebase/app'
import { ref, onValue, get, update, serverTimestamp } from 'firebase/database'
import { bancoDados } from '../firebase/FirebaseConexao'
import { useAutenticacao } from './useAutenticacao'
import { type PerfilTipo } from '../tipos/Perfil'

export function usePerfil(){
    const { usuario } = useAutenticacao()
    const [perfil, setPerfil] = useState<PerfilTipo | null>(null)
    const [erro, setErro] = useState('')

    useEffect(() => {
        if (!usuario?.codigo) return
        const referencia = ref(bancoDados, `usuarios/${usuario.codigo}`)
        const unsubscribe = onValue(referencia, (resposta) => {
            setPerfil(resposta.val() as PerfilTipo | null)
        }, (error) => {
            setErro(`Erro ao carregar perfil! (${error.message})`)
        })
        return () => unsubscribe()
    }, [usuario?.codigo])

    const modificarUsuario = async (dados: PerfilTipo): Promise<string> => {
        let retorno = 'sucesso'
        try {
            if (!usuario?.codigo) return 'Usuário não autenticado.'
            const referencia = ref(bancoDados, `usuarios/${usuario.codigo}`)
            const resposta = await get(referencia)
            await update(referencia, {
                nome: dados.nome,
                telefone: dados.telefone,
                propriedade: dados.propriedade,
                ...(!resposta.exists() ? {criadoEm: serverTimestamp()} : {}),
                atualizadoEm: serverTimestamp()
            })
        } catch (error) {
            if (error instanceof FirebaseError) {
                switch (error.code) {
                    default:
                        retorno = `Erro ao modificar perfil! (${error.code}: ${error.message})`
                        break
                }
            } else {
                retorno = `Erro imprevisto! (${error})`
            }
        }
        return retorno
    }
    return {perfil, erro, modificarUsuario}
}
