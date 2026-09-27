import estilos from './Cabecalho.module.css'
import { Link, useLocation } from 'react-router-dom'
import { LuLeaf } from 'react-icons/lu'
import { FiHome, FiInfo, FiLogIn } from 'react-icons/fi'

export function Cabecalho() {
  const location = useLocation()
  const rotaAtiva = (path: string) => location.pathname === path

  return (
    <nav className={estilos.cabecalho}>
      <div className={estilos.conteiner}>
        <Link to='/' className={estilos.logo}>
          <LuLeaf className={estilos.logoIcone} />
          <span>Agro Sync</span>
        </Link>
        <ul className={estilos.menu}>
          <li>
            <Link
              to='/sobre'
              className={`${estilos.link} ${rotaAtiva('/sobre') ? estilos.ativo : ''}`}
            >
              <FiHome />
              <span>Início</span>
            </Link>
          </li>
          <li>
            <Link
              to='/dicas'
              className={`${estilos.link} ${rotaAtiva('/dicas') ? estilos.ativo : ''}`}
            >
              <FiInfo />
              <span>Dicas</span>
            </Link>
          </li>
          <li>
            <Link
              to='/'
              className={`${estilos.link} ${estilos.botaoLogin} ${rotaAtiva('/') ? estilos.ativo : ''}`}
            >
              <FiLogIn />
              <span>Entrar</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
