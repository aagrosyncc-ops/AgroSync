import type { ComponentProps } from 'react'
import { Tabs } from 'expo-router'
import { View, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { MaterialIcons } from '@react-native-vector-icons/material-icons'

// Cores do menu (estilo Instagram escuro)
const COR_FUNDO = '#16502d' // fundo da barra
const COR_ICONE = '#FFFFFF' // ícones brancos
const COR_PILULA = '#3d8b5f' // "pílula" cinza atrás do ícone ativo

type IconeAbaProps = {
  nome: ComponentProps<typeof MaterialIcons>['name']
  focado: boolean
}

// Um ícone do menu: se estiver ativo, ganha a pílula atrás
function IconeAba({ nome, focado }: IconeAbaProps) {
  return (
    <View style={[estilos.icone, focado && estilos.iconeAtivo]}>
      <MaterialIcons name={nome} size={26} color={COR_ICONE} />
    </View>
  )
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets() // altura da barrinha do celular embaixo

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          backgroundColor: COR_FUNDO,
          borderTopWidth: 0,
          elevation: 0,
          height: 56 + insets.bottom,
          paddingTop: 8,
          paddingBottom: insets.bottom,
        },
      }}
    >
      <Tabs.Screen
        name='dashboard'
        options={{
          tabBarIcon: ({ focused }) => <IconeAba nome='dashboard' focado={focused} />,
        }}
      />

      <Tabs.Screen
        name='sensores'
        options={{
          tabBarIcon: ({ focused }) => <IconeAba nome='sensors' focado={focused} />,
        }}
      />

      <Tabs.Screen
        name='alertas'
        options={{
          tabBarIcon: ({ focused }) => <IconeAba nome='notifications' focado={focused} />,
        }}
      />

      <Tabs.Screen
        name='configuracoes'
        options={{
          tabBarIcon: ({ focused }) => <IconeAba nome='settings' focado={focused} />,
        }}
      />
    </Tabs>
  )
}

const estilos = StyleSheet.create({
  icone: {
    width: 64,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconeAtivo: {
    backgroundColor: COR_PILULA,
  },
})