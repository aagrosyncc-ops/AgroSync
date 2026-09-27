import estilos from './Principal.module.css'
import { Menu } from './Menu'
import { Outlet } from 'react-router-dom'

export function Principal() {
  return (
    <div className={estilos.conteiner}>
      <Menu />

      <div className={estilos.areaPrincipal}>
        <main className={estilos.conteudo}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
