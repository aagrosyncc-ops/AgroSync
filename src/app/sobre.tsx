import { ScrollView, StyleSheet, Text, View, Image, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import { MaterialIcons } from '@react-native-vector-icons/material-icons'
import { Cores } from '@/constants/Cores'
import { Fontes } from '@/constants/Fontes'

export default function sobre() {
    return (
        <SafeAreaView style={estilos.conteiner}>
            <ScrollView contentContainerStyle={estilos.scroll}>

                {/* Botão de voltar */}
                <Pressable onPress={() => router.back()} style={estilos.botaoVoltar}>
                    <MaterialIcons name="arrow-back" size={Fontes.grande1} color={Cores.secundariaClara} />
                </Pressable>

                {/* Hero */}
                <LinearGradient
                    colors={[Cores.primaria, Cores.primariaClara]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={estilos.hero}
                >
                    <Text style={estilos.titulo}>
                        Monitore a qualidade do solo da sua plantação
                    </Text>
                    <Text style={estilos.subtitulo}>
                        O Agro Sync oferece monitoramento inteligente em tempo real para
                        plantações de pequeno e médio porte. Acompanhe NPK, pH,
                        temperatura, umidade e luminosidade com precisão.
                    </Text>
                </LinearGradient>

                {/* Como Funciona */}
                <View style={estilos.secao}>
                    <Text style={estilos.secaoTitulo}>Como Funciona</Text>
                    {[
                        { numero: '1', titulo: 'Instale o Sensor', texto: 'Posicione o dispositivo Agro Sync no solo da sua plantação.' },
                        { numero: '2', titulo: 'Conecte ao Sistema', texto: 'O sensor envia dados automaticamente para a nuvem via Wi-Fi.' },
                        { numero: '3', titulo: 'Monitore Online', texto: 'Acesse o dashboard e acompanhe todas as métricas em tempo real.' },
                    ].map((passo) => (
                        <View key={passo.numero} style={estilos.passo}>
                            <View style={estilos.passoNumero}>
                                <Text style={estilos.passoNumeroTexto}>{passo.numero}</Text>
                            </View>
                            <Text style={estilos.passoTitulo}>{passo.titulo}</Text>
                            <Text style={estilos.passoTexto}>{passo.texto}</Text>
                        </View>
                    ))}
                </View>

                {/* Recursos */}
                <View style={estilos.secao}>
                    <Text style={estilos.secaoTitulo}>Recursos do Sistema</Text>
                    {[
                        { icone: 'bar-chart', titulo: 'Monitoramento em Tempo Real', texto: 'Acompanhe NPK, pH, temperatura, umidade e luminosidade em tempo real.' },
                        { icone: 'memory', titulo: 'Sensores Inteligentes', texto: 'Dispositivos IoT de alta precisão que coletam dados continuamente do solo.' },
                        { icone: 'water-drop', titulo: 'Gestão de Irrigação', texto: 'Receba alertas de umidade e otimize o uso da água.' },
                        { icone: 'cloud', titulo: 'Dados na Nuvem', texto: 'Acesse seus dados de qualquer lugar, com total segurança.' },
                    ].map((recurso) => (
                        <View key={recurso.titulo} style={estilos.recursoCard}>
                            <MaterialIcons name={recurso.icone as any} size={Fontes.grande2} color={Cores.accent} />
                            <Text style={estilos.recursoTitulo}>{recurso.titulo}</Text>
                            <Text style={estilos.recursoTexto}>{recurso.texto}</Text>
                        </View>
                    ))}
                </View>

                {/* Benefícios */}
                <View style={estilos.secao}>
                    <Text style={estilos.secaoTitulo}>Por que usar o Agro Sync?</Text>
                    {[
                        'Aumento de até 30% na produtividade',
                        'Redução de desperdício de água e insumos',
                        'Prevenção de problemas no solo',
                        'Tomada de decisão baseada em dados',
                        'Histórico completo das suas plantações',
                        'Alertas personalizados para cada cultura',
                    ].map((beneficio) => (
                        <View key={beneficio} style={estilos.beneficioLinha}>
                            <MaterialIcons name="check-circle" size={Fontes.medio2} color={Cores.accent} />
                            <Text style={estilos.beneficioTexto}>{beneficio}</Text>
                        </View>
                    ))}
                </View>

                {/* Integrantes */}
                <View style={estilos.secao}>
                    <Text style={estilos.secaoTitulo}>Integrantes do Grupo</Text>
                    <View style={estilos.integrantesLinha}>
                        {[
                            { nome: 'Diogo Vieira da Costa', foto: require('@/assets/images/layout/diogo.jpg') },
                            { nome: 'Jean de Melo Prates', foto: require('@/assets/images/layout/jean.jpeg') },
                        ].map((integrante) => (
                            <View key={integrante.nome} style={estilos.integranteCard}>
                                <Image style={estilos.integranteFoto} source={integrante.foto} />
                                <Text style={estilos.integranteNome}>{integrante.nome}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Rodapé */}
                <View style={estilos.rodape}>
                    <Text style={estilos.rodapeTexto}>© 2026 AgroSync — Todos os direitos reservados</Text>
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

const estilos = StyleSheet.create({
    conteiner: {
        flex: 1,
        backgroundColor: Cores.primaria
    },
    scroll: {
        flexGrow: 1
    },
    botaoVoltar: {
        padding: 16
    },
    hero: {
        padding: 30,
        alignItems: 'center',
        gap: 12
    },
    titulo: {
        fontFamily: Fontes.baseBold,
        fontSize: Fontes.grande2,
        color: Cores.secundariaClara,
        textAlign: 'center'
    },
    subtitulo: {
        fontFamily: Fontes.baseRegular,
        fontSize: Fontes.medio1,
        color: Cores.secundariaClara,
        opacity: 0.9,
        textAlign: 'center'
    },
    secao: {
        padding: 24,
        gap: 12,
        backgroundColor: Cores.secundariaEscura
    },
    secaoTitulo: {
        fontFamily: Fontes.baseBold,
        fontSize: Fontes.medio2,
        color: Cores.secundariaClara,
        textAlign: 'center',
        marginBottom: 10
    },
    passo: {
        alignItems: 'center',
        gap: 4,
        marginBottom: 16
    },
    passoNumero: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Cores.accent,
        alignItems: 'center',
        justifyContent: 'center'
    },
    passoNumeroTexto: {
        color: Cores.secundariaClara,
        fontFamily: Fontes.baseBold,
        fontSize: Fontes.medio1
    },
    passoTitulo: {
        fontFamily: Fontes.baseBold,
        fontSize: Fontes.medio1,
        color: Cores.secundariaClara
    },
    passoTexto: {
        fontFamily: Fontes.baseRegular,
        fontSize: Fontes.pequeno,
        color: Cores.secundariaClara,
        textAlign: 'center',
        opacity: 0.85
    },
    recursoCard: {
        backgroundColor: Cores.secundaria,
        borderRadius: 12,
        padding: 18,
        gap: 8,
        marginBottom: 14,
        alignItems: 'center'
    },
    recursoTitulo: {
        fontFamily: Fontes.baseBold,
        fontSize: Fontes.medio1,
        color: Cores.primariaEscura,
        textAlign: 'center'
    },
    recursoTexto: {
        fontFamily: Fontes.baseRegular,
        fontSize: Fontes.pequeno,
        color: '#4A4A4A',
        textAlign: 'center'
    },
    beneficioLinha: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8
    },
    beneficioTexto: {
        fontFamily: Fontes.baseRegular,
        fontSize: Fontes.medio1,
        color: Cores.secundariaClara,
        flexShrink: 1
    },
    integrantesLinha: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 16
    },
    integranteCard: {
        alignItems: 'center',
        gap: 6,
        width: 130
    },
    integranteFoto: {
        width: 80,
        height: 80,
        borderRadius: 40
    },
    integranteNome: {
        fontFamily: Fontes.baseBold,
        fontSize: Fontes.pequeno,
        color: Cores.secundariaClara,
        textAlign: 'center'
    },
    rodape: {
        backgroundColor: Cores.secundariaEscura,
        paddingVertical: 20,
        alignItems: 'center'
    },
    rodapeTexto: {
        fontFamily: Fontes.baseRegular,
        fontSize: Fontes.pequeno,
        color: Cores.secundariaClara,
        opacity: 0.7
    },
})