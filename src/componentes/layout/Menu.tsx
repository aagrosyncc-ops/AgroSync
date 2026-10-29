import estilos from './Menu.module.css'
import { LayoutContexto } from '../../contextos/LayoutContexto'
import { useAutenticacao } from '../../hooks/useAutenticacao'

import { usePerfil } from '../../hooks/usePerfil'
import React, { useState, useEffect, useRef, useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { MdDashboard, MdNotifications, MdInsertChart, MdLogout } from 'react-icons/md'

export function Menu() {
  const { deslogar } = useAutenticacao()
  const { perfil } = usePerfil()
  const [erro, setErro] = useState('')
  const { menuAbertoContexto, setMenuAbertoContexto } = useContext(LayoutContexto)
  const location = useLocation()
  const menuRef = useRef<HTMLElement>(null)
  const navegacao = useNavigate()

  const controlarMenu = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    setMenuAbertoContexto(!menuAbertoContexto)
  }

  const sair = async () => {
    let retorno = await deslogar()
    if (retorno == 'sucesso') {
      navegacao('/')
    } else {
      setErro(retorno)
    }
  }

  useEffect(() => {
    const fecharMenuExterno = (e: MouseEvent) => {
      if (menuAbertoContexto && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuAbertoContexto(false)
      }
    }
    document.addEventListener('mouseup', fecharMenuExterno)
    return () => document.removeEventListener('mouseup', fecharMenuExterno)
  }, [menuAbertoContexto, setMenuAbertoContexto])

  return (
    <>
      <div
        className={`${estilos.sobreposicao} ${menuAbertoContexto ? estilos.sobreposicaoVisivel : ''}`}
        aria-hidden='true'
      />

      <aside
        ref={menuRef}
        className={`${estilos.menuLateral} ${menuAbertoContexto ? estilos.menuLateralAberto : ''}`}
      >
        <div className={estilos.alternador}>
          <a
            href='#'
            className={estilos.botaoMenu}
            onClick={controlarMenu}
            aria-label='Abrir ou fechar menu'
          >
            <span></span>
          </a>
        </div>

        <div className={estilos.conteudoMenu}>
          <div className={estilos.perfil}>
            <h3 className={estilos.nomePerfil}>{perfil?.nome || 'Minha conta'}</h3>
            {erro && <p role='alert'>{erro}</p>}
            <span className={estilos.identificacaoPerfil}>AgroSync</span>
          </div>

          <nav className={estilos.menuNavegacao}>
            <ul>
              <li className={location.pathname === '/principal' ? estilos.itemAtivo : ''}>
                <Link to='/principal'>
                  <span className={estilos.iconeNavegacao}><MdDashboard /></span>
                  Painel
                </Link>
              </li>
              <li className={location.pathname === '/principal/alertas' ? estilos.itemAtivo : ''}>
                <Link to='alertas'>
                  <span className={estilos.iconeNavegacao}><MdNotifications /></span>
                  Alertas
                </Link>
              </li>
              <li className={location.pathname === '/principal/relatorios' ? estilos.itemAtivo : ''}>
                <Link to='relatorios'>
                  <span className={estilos.iconeNavegacao}><MdInsertChart /></span>
                  Relatórios
                </Link>
              </li>
            </ul>
          </nav>

          <nav className={estilos.menuRodape}>
            <ul>
              <li>
                <button onClick={sair}>
                  <span className={estilos.iconeNavegacao}><MdLogout /></span>
                  Sair
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </>
  )
}