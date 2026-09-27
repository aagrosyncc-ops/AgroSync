import estilos from './Perfil.module.css'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useAutenticacao } from '../hooks/useAutenticacao'
import { usePerfil } from '../hooks/usePerfil'
import { type PerfilTipo } from '../tipos/Perfil'

const perfilSchema = z.object({
  nome: z.string().trim().min(3, 'O nome deve ter pelo menos 3 caracteres.').max(100),
  telefone: z.string().trim().max(30),
  propriedade: z.string().trim().max(150),
})

type FormValues = {
    nome: string
    telefone: string
    propriedade: string
}

export function Perfil() {
  const { usuario } = useAutenticacao()
  const perfilUsuario = usePerfil()
  const { perfil } = perfilUsuario
  const [mensagem, setMensagem] = useState<string>('')
  const [ocupado, setOcupado] = useState<boolean>(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(perfilSchema),
    values: {
      nome: perfil?.nome ?? '',
      telefone: perfil?.telefone ?? '',
      propriedade: perfil?.propriedade ?? '',
    },
  })

  const dadosUsuario: PerfilTipo = {nome: '', telefone: '', propriedade: ''}

  const modificarUsuario = async (data: FormValues) => {
      dadosUsuario.nome = data.nome
      dadosUsuario.telefone = data.telefone
      dadosUsuario.propriedade = data.propriedade
      setOcupado(true)
      let retorno = await perfilUsuario.modificarUsuario(dadosUsuario)
      if (retorno == 'sucesso') {
          setMensagem('Perfil salvo com sucesso.')
      } else {
          setMensagem(retorno)
      }
      setOcupado(false)
  }

  return (
    <div className={estilos.conteiner}>
      <div className={estilos.centro}>
        <form className={estilos.cartao} onSubmit={handleSubmit(modificarUsuario)}>
          <h1>Meu perfil</h1>
          <div className={estilos.campo}>
            <label htmlFor='nome'>Nome</label>
            <input
              className={estilos.entrada}
              id='nome'
              required
              minLength={3}
              maxLength={100}
              {...register('nome')}
            />
          </div>
          <div className={estilos.campo}>
            <label htmlFor='email'>E-mail</label>
            <input className={estilos.entrada} id='email' readOnly value={usuario?.email ?? ''} />
          </div>
          <div className={estilos.campo}>
            <label htmlFor='telefone'>Telefone</label>
            <input
              className={estilos.entrada}
              id='telefone'
              type='tel'
              maxLength={30}
              {...register('telefone')}
            />
          </div>
          <div className={estilos.campo}>
            <label htmlFor='propriedade'>Propriedade / Fazenda</label>
            <input
              className={estilos.entrada}
              id='propriedade'
              maxLength={150}
              {...register('propriedade')}
            />
          </div>
          {Object.values(errors).map((erro, indice) => (
            <p key={indice} role='alert'>
              {erro.message}
            </p>
          ))}
          <button disabled={ocupado} className={estilos.botaoSalvar}>
            {ocupado ? 'Aguarde...' : 'Salvar perfil'}
          </button>
          <p role='status'>{mensagem}</p>
        </form>
      </div>
    </div>
  )
}
