import estilos from './Login.module.css'
import { Cabecalho } from '../componentes/layout/Cabecalho'
import { Rodape } from '../componentes/layout/Rodape'
import { FiMail, FiLock } from 'react-icons/fi'
import { LuLeaf } from 'react-icons/lu'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { type UsuarioTipo } from '../tipos/Usuario'
import { ModalMensagem } from '../componentes/ModalMensagem'
import { useAutenticacao } from '../hooks/useAutenticacao'


type FormValues = {
    email: string
    senha: string
}

const loginSchema = z.object({

    email: z.email({message: 'Informe um e-mail válido.'}),

    senha: z.string()
            .length(6, {message: 'Informe uma senha com 6 caracteres.'})
})

export function Login(){

    const [carregando, setCarregando] = useState(false)

    const [modalMensagemVisivel, setModalMensagemVisivel] = useState(false)
    const [modalMensagemTitulo, setModalMensagemTitulo] = useState('')
    const [modalMensagemTexto, setModalMensagemTexto] = useState('')

    const exibirModal = () => {
        setModalMensagemTitulo('Autenticação')
        setModalMensagemVisivel(true)
    }

    const ocultarModal = () => setModalMensagemVisivel(false)

    const { 
        register, handleSubmit, formState:{errors} 
    } = useForm<FormValues>(
        {resolver: zodResolver(loginSchema)}
    )

    const navegacao = useNavigate()

    const dadosUsuario: UsuarioTipo = {
        email: '',
        senha: ''
    }

    //objeto de autenticação
    const autenticacao = useAutenticacao()

    const autenticarUsuario = async (data: FormValues) => {

        dadosUsuario.email = data.email
        dadosUsuario.senha = data.senha

        setCarregando(true)
        let retorno = await autenticacao.validarUsuario(data.email, data.senha)

        setCarregando(false)

        if(retorno == 'sucesso'){
            navegacao('principal')
        }else{
            setModalMensagemTexto(retorno)
            exibirModal()
        }

    }

    const novoUsuario = () => {
        navegacao('usuario')
    }

  return (
    <div className={estilos.pagina}>
      <Cabecalho />
      <main className={estilos.conteudoPagina}>
    <div className={estilos.conteiner}>
      <div className={estilos.cartao}>
        <div className={estilos.cartaoEsquerda}>
          <div className={estilos.conteudoMarca}>
            <div className={estilos.conteinerLogo}>
              <LuLeaf className={estilos.iconeLogo} />
            </div>
            <h1>Agro Sync</h1>
            <p>
              Monitore a qualidade do solo da sua plantação em tempo real. Dados precisos para
              decisões inteligentes.
            </p>
            <div className={estilos.listaRecursos}>
              <div className={estilos.recurso}>
                <span className={estilos.pontoRecurso} />
                <span>Monitoramento NPK em tempo real</span>
              </div>
              <div className={estilos.recurso}>
                <span className={estilos.pontoRecurso} />
                <span>Alertas personalizados</span>
              </div>
              <div className={estilos.recurso}>
                <span className={estilos.pontoRecurso} />
                <span>Relatórios detalhados</span>
              </div>
            </div>
          </div>
        </div>

        <div className={estilos.cartaoDireita}>
          <div className={estilos.conteinerFormulario}>
            <h2>Bem-vindo de volta</h2>
            <p className={estilos.subtitulo}>Entre com suas credenciais para acessar o dashboard</p>
            {errors.email && <p role='alert'>{errors.email.message}</p>}
            {errors.senha && <p role='alert'>{errors.senha.message}</p>}
            <form onSubmit={handleSubmit(autenticarUsuario)} className={estilos.formulario}>
              <div className={estilos.grupoCampos}>
                <label htmlFor='email'>E-mail</label>
                <div className={estilos.conteinerCampo}>
                  <FiMail className={estilos.iconeCampo} />
                  <input
                    type='email'
                    id='email'
                    autoComplete='email'
                    placeholder='seu@email.com'
                    {...register('email')}
                    required
                  />
                </div>
              </div>

              <div className={estilos.grupoCampos}>
                <label htmlFor='senha'>Senha</label>
                <div className={estilos.conteinerCampo}>
                  <FiLock className={estilos.iconeCampo} />
                  <input
                    type='password'
                    id='senha'
                    autoComplete='current-password'
                    placeholder='Sua senha'
                    {...register('senha')}
                    required
                  />
                </div>
              </div>

              <button type='submit' disabled={carregando} className={estilos.botaoEntrar}>
                {carregando ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            <p className={estilos.cadastro}>
              Não tem uma conta? <a onClick={novoUsuario}>Cadastre-se</a>
            </p>
          </div>
        </div>
      </div>
      {carregando && (
        <div className={estilos.fundoCarregamento}>
          <div className={estilos.cartaoCarregamento}>
            <div className={estilos.indicadorCarregamento}></div>
            <h2>Entrando...</h2>
            <p>Conectando ao AgroSync...</p>
          </div>
        </div>
      )}
    </div>
        <ModalMensagem exibir={modalMensagemVisivel} ocultar={() => ocultarModal()} titulo={modalMensagemTitulo} texto={modalMensagemTexto} />
      </main>
      <Rodape />
    </div>
  )
}
