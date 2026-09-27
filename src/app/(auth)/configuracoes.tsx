import { useEffect } from 'react'
import { router } from 'expo-router'
import { Text, StyleSheet, View, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Cores } from '@/constants/Cores'
import { Fontes } from '@/constants/Fontes'
import { useAutenticacao } from '@/hooks/useAuthenticacao'
import { CabecalhoApp } from '@/components/CabecalhoApp'

export default function configuracoes() {

    const { usuarioContexto, carregando } = useAutenticacao()

    useEffect(() => {
        if (!carregando && !usuarioContexto) {
            router.replace('/')
        }
    }, [carregando, usuarioContexto])

    if (carregando || !usuarioContexto) {
        return (
            <SafeAreaView style={estilos.carregandoConteiner}>
                <ActivityIndicator size="large" color={Cores.accent} />
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={estilos.conteiner}>
            <CabecalhoApp titulo="Configuracoes" />
            <View style={estilos.centroConteudo}>
                <Text style={estilos.placeholder}>Tela de Configuraçoes - Em construção</Text>
            </View>
        </SafeAreaView>
    )
}

const estilos = StyleSheet.create({
    conteiner: {
        flex: 1,
        backgroundColor: Cores.secundariaEscura
    },

    carregandoConteiner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Cores.secundariaEscura,
    },

    centroConteudo: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24

    },
    placeholder: {
        fontFamily: Fontes.baseRegular,
        fontSize: Fontes.medio1,
        color: Cores.secundariaClara,
        textAlign: 'center',
        opacity: 0.7,
    },
})