import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Login } from '../paginas/Login'
import { NovoUsuario } from '../paginas/NovoUsuario'
import { Sobre } from '../paginas/Sobre'
import { Dicas } from '../paginas/Dicas'
import { Principal } from '../componentes/layout/Principal'
import { Inicial } from '../paginas/Inicial'
import { Alertas } from '../paginas/Alertas'
import { Relatorios } from '../paginas/Relatorios'
import { Configuracoes } from '../paginas/Configuracoes'
import { Perfil } from '../paginas/Perfil'
import { RotaProtegida } from './RotaProtegida'

export function Rotas(){
    return(
        <BrowserRouter>
            <Routes>
                <Route path='/' element={ <Login /> } />
                <Route path='usuario' element={ <NovoUsuario /> } />
                <Route path='sobre' element={ <Sobre /> } />
                <Route path='dicas' element={ <Dicas /> } />

                <Route path='principal' element={ <RotaProtegida><Principal /></RotaProtegida> } >
                    <Route index element={ <RotaProtegida><Inicial /></RotaProtegida> } />
                    <Route path='alertas' element={ <RotaProtegida><Alertas /></RotaProtegida> } />
                    <Route path='relatorios' element={ <RotaProtegida><Relatorios /></RotaProtegida> } />
                    <Route path='configuracoes' element={ <RotaProtegida><Configuracoes /></RotaProtegida> } />
                    <Route path='perfil' element={ <RotaProtegida><Perfil /></RotaProtegida> } />
                </Route>
            </Routes>
        </BrowserRouter>
    )
}
