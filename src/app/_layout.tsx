import { StatusBar } from 'expo-status-bar'
import { Stack } from 'expo-router'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { AutenticacaoProvider } from '@/contexto/AuthenticacaoContexto'
import { useFonts } from 'expo-font'

export default function RootLayout() {

const [fontsLoaded] = useFonts({
  'Montserrat-Regular': require('../../assets/fonts/Montserrat-Regular.ttf'),
  'Montserrat-Light': require('../../assets/fonts/Montserrat-Light.ttf'),
  'Montserrat-Bold': require('../../assets/fonts/Montserrat-Bold.ttf'),
  'PermanentMarker-Regular': require('../../assets/fonts/PermanentMarker-Regular.ttf'),
})

if (!fontsLoaded) {
  return null;
}

  return (
    <AutenticacaoProvider>
      <SafeAreaProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="cadastro" />
          <Stack.Screen name="sobre" />
          <Stack.Screen name="(auth)" />
        </Stack>
      </SafeAreaProvider>
    </AutenticacaoProvider>
  )
}