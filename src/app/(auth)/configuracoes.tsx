import { useEffect } from 'react'
import { router } from 'expo-router'
import { Text, StyleSheet, View, ActivityIndicator, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { MaterialIcons } from '@react-native-vector-icons/material-icons'
import { Cores } from '@/constants/Cores'
import { Fontes } from '@/constants/Fontes'
import { useAutenticacao } from '@/hooks/useAuthenticacao'
import { useCultura } from '@/hooks/useCultura'
import { NOMES_CULTURA, CulturaTipo } from '@/tipos/FaixasIdeais'
import { CabecalhoApp } from '@/components/CabecalhoApp'

const OPCOES_CULTURA: CulturaTipo[] = ['padrao', 'hortalicas']

export default function configuracoes() {

    const { usuarioContexto, carregando } = useAutenticacao()
    const { cultura, salvarCultura } = useCultura()

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
            <CabecalhoApp titulo="Configurações" />

            <View style={estilos.centroConteudo}>

                <Text style={estilos.tituloSecao}>Cultura plantada</Text>
                <Text style={estilos.descricaoSecao}>
                    Define as faixas ideais usadas no Dashboard e nos Alertas.
                </Text>

                <View style={estilos.listaOpcoes}>
                    {OPCOES_CULTURA.map((opcao) => (
                        <Pressable
                            key={opcao}
                            style={estilos.opcao}
                            onPress={() => salvarCultura(opcao)}
                        >
                            <Text style={estilos.textoOpcao}>{NOMES_CULTURA[opcao]}</Text>
                            {cultura === opcao && (
                                <MaterialIcons name="check-circle" size={22} color={Cores.accent} />
                            )}
                        </Pressable>
                    ))}
                </View>

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
        padding: 24,
        gap: 4,
    },

    tituloSecao: {
        fontFamily: Fontes.baseBold,
        fontSize: Fontes.medio2,
        color: Cores.secundariaClara,
    },

    descricaoSecao: {
        fontFamily: Fontes.baseRegular,
        fontSize: Fontes.pequeno,
        color: Cores.secundariaClara,
        opacity: 0.7,
        marginBottom: 12,
    },

    listaOpcoes: {
        gap: 10,
    },

    opcao: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Cores.secundaria,
        borderRadius: 12,
        padding: 16,
    },

    textoOpcao: {
        fontFamily: Fontes.baseRegular,
        fontSize: Fontes.medio1,
        color: Cores.primariaEscura,
    },
})