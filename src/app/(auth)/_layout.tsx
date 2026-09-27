import { Tabs } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { MaterialIcons } from '@react-native-vector-icons/material-icons'
import { Cores } from '@/constants/Cores'
import { Fontes } from '@/constants/Fontes'

export default function TabsLayout() {

  const insets = useSafeAreaInsets()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: Cores.primariaClara,
        tabBarInactiveTintColor: Cores.secundariaClara,
        tabBarStyle: {
          backgroundColor: Cores.primaria,
          paddingBottom: insets.bottom || 16,
          height: 60 + (insets.bottom || 0),
          borderTopWidth: 0,
          paddingTop: 10,
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="dashboard" size={Fontes.grande2} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="sensores"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="sensors" size={Fontes.grande2} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="perfil"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" size={Fontes.grande2} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="alertas"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="notifications" size={Fontes.grande2} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="configuracoes"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="settings" size={Fontes.grande2} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}