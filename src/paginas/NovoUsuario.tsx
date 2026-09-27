import estilos from './NovoUsuario.module.css'
import { Cabecalho } from '../componentes/layout/Cabecalho'
import { Rodape } from '../componentes/layout/Rodape'
import { FiMail, FiLock, FiLogIn, FiUser } from 'react-icons/fi'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ModalMensagem } from '../componentes/ModalMensagem'
import { type UsuarioTipo } from '../tipos/Usuario'
import { useAutenticacao } from '../hooks/useAutenticacao'


type FormValues = {
    nome: string
    email: string
    senha: string
}

const loginSchema = z.object({

    nome: z.string()
           .min(2, 'Mínimo de 2 caracteres.')
           .max(25, 'Máximo de 25 caracteres.'),

    email: z.email({message: 'Informe um e-mail válido.'}),

    senha: z.string()
            .length(6, {message: 'Informe uma senha com 6 caracteres.'})
})

export function NovoUsuario(){

    const [modalMensagemVisivel, setModalMensagemVisivel] = useState(false)
    const [modalMensagemTitulo, setModalMensagemTitulo] = useState('')
    const [modalMensagemTexto, setModalMensagemTexto] = useState('')

    const { 
        register,handleSubmit,formState:{errors, isSubmitting} 
    } = useForm<FormValues>(
        {resolver: zodResolver(loginSchema)}
    )

    const navegacao = useNavigate()

    const dadosUsuario: UsuarioTipo = {
        nome: '',
        email: '',
        senha: ''
    }

    //objeto de autenticação
    const autenticacao = useAutenticacao()

    const adicionarUsuario = async (data: FormValues) => {

        dadosUsuario.nome = data.nome
        dadosUsuario.email = data.email
        dadosUsuario.senha = data.senha

        //autenticação do usuário (Authentication)
        let retorno = await autenticacao.criarAutenticacaoUsuario(data.email, data.senha)

        if (retorno == 'sucesso') {
            setModalMensagemTexto(`Seja bem-vindo ${dadosUsuario.nome}!`)
        }else {
            setModalMensagemTexto(retorno)
        }

        exibirModal()
    }

    const exibirModal = () => {
        setModalMensagemTitulo('Novo usuário')
        setModalMensagemVisivel(true)
    }

    const ocultarModal = async () => {

        setModalMensagemVisivel(false)

        //ao logar os dados estarão completos
        await autenticacao.deslogar()

        navegacao('/')
    }

  return (
    <div className={estilos.pagina}>
      <Cabecalho />
      <main className={estilos.conteudoPagina}>
    <div className={estilos.conteiner}>
      <div className={estilos.centro}>
        <form className={estilos.formulario} onSubmit={handleSubmit(adicionarUsuario)}>
          <h2 className={estilos.tituloFormulario}>Não tem uma conta? Crie uma!</h2>

          <div className={estilos.campo}>
            <label htmlFor='nome'>Nome</label>
            <div className={estilos.conteinerCampo}>
              <FiUser className={estilos.iconeCampo} />
              <input
                id='nome'
                type='text'
                placeholder='Nome Completo'
                className={estilos.entrada}
                {...register('nome')}
              />
            </div>
            {errors.nome && <p className={estilos.erro}>{errors.nome.message}</p>}
          </div>

          <div className={estilos.campo}>
            <label htmlFor='email'>E-mail</label>
            <div className={estilos.conteinerCampo}>
              <FiMail className={estilos.iconeCampo} />
              <input
                id='email'
                autoComplete='email'
                type='text'
                placeholder='seu@email.com'
                className={estilos.entrada}
                {...register('email')}
              />
            </div>
            {errors.email && <p className={estilos.erro}>{errors.email.message}</p>}
          </div>

          <div className={estilos.campo}>
            <label htmlFor='senha'>Senha</label>
            <div className={estilos.conteinerCampo}>
              <FiLock className={estilos.iconeCampo} />
              <input
                id='senha'
                autoComplete='new-password'
                type='password'
                placeholder='••••••••'
                className={estilos.campoSenha}
                {...register('senha')}
              />
            </div>
            {errors.senha && <p className={estilos.erro}>{errors.senha.message}</p>}
          </div>
          <button
            type='submit'
            disabled={isSubmitting}
            className={estilos.botaoEntrar}
          >
            <FiLogIn />
            <span>{isSubmitting ? 'Cadastrando...' : 'Cadastrar'}</span>
          </button>
        </form>
      </div>

      <ModalMensagem
        exibir={modalMensagemVisivel}
        titulo={modalMensagemTitulo}
        texto={modalMensagemTexto}
        ocultar={() => ocultarModal()}
      />
    </div>
      </main>
      <Rodape />
    </div>
  )
}
