import React from 'react'
import { Input } from '../components/input'
import { Button } from '../components/button/button'
import { useAuth } from '@/hooks/useAuth'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'

const schema = z.object({
  email: z.string().email('Email inválido').nonempty('Campo obrigatório'),
  password: z.string().min(6, 'Senha deve possuir no mínimo 6 caracteres').nonempty('Senha é obrigatória'),
})

type LoginSchema = z.infer<typeof schema>

export const Login: React.FC = () => {
  const { login, loading } = useAuth()
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<LoginSchema>({
    resolver: zodResolver(schema),
  })

  const handleLogin = (data: LoginSchema) => {
    login(data)
  }

  return (
    <div className='flex flex-col items-center justify-cente min-h-[100dvh] py-10'>
      <h1 className='text-center text-primary-600 font-bold text-2xl mt-10'>
        Eloop
      </h1>
      <div className='flex flex-col gap-6 w-3xs my-auto'>
        <h2 className='text-center text-primary-600 font-bold text-xl'>
          Acesse sua conta
        </h2>
        <form
          onSubmit={handleSubmit(handleLogin)}
          className='flex flex-col gap-6'
        >
          <Controller
            name='email'
            control={control}
            render={({ field }) => (
              <Input
                label='Email'
                type='email'
                {...field}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            name='password'
            control={control}
            render={({ field }) => (
              <Input
                label='Senha'
                type='password'
                {...field}
                error={errors.password?.message}
              />
            )}
          />

          <Button className='w-full' type='submit' disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </div>
      <div className='mt-auto text-primary-600 font-bold'>
        <Link to={'/estabelecimento/criar'}>Criar programa de fidelidade</Link>
      </div>
    </div>
  )
}
