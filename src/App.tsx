import { Rotas } from './rotas/Rotas'
import { LayoutProvider } from './contextos/LayoutContexto'
import { AutenticacaoProvider } from './contextos/AutenticacaoContexto'

function App() {
  return (
    <AutenticacaoProvider>
      <LayoutProvider>
        <Rotas />
      </LayoutProvider>
    </AutenticacaoProvider>
  )
}

export default App
