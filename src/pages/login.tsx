import React from 'react'
import { Input } from '../components/input'
import { Button } from '../components/button/button'
import { useAuth } from '@/hooks/useAuth'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  email: z.string().email('Email inválido').nonempty('Campo obrigatório'),
  password: z.string().nonempty('Campo obrigatório'),
})

type LoginSchema = z.infer<typeof schema>

export const Login: React.FC = () => {
  const { login, loading } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(schema),
  })

  const handleLogin = (data: LoginSchema) => {
    login(data)
  }

  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='flex flex-col gap-6 w-3xs'>
        <h2 className='text-center'>
          <b>Acesse sua conta</b>
        </h2>
        <Input
          label='Email'
          type='email'
          {...register('email')}
          error={errors.email?.message}
        />

        <Input
          label='Senha'
          type='password'
          {...register('password')}
          error={errors.password?.message}
        />

        <Button
          className='w-full'
          onClick={handleSubmit(handleLogin)}
          disabled={loading}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </Button>
      </div>
    </div>
  )
}
