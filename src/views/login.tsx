import React, { useState } from 'react'
import { Input } from '../components/input'
import { Button } from '../components/button/button'
import { useAuth } from '@/hooks/useAuth'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import Icon from '@/components/icon'

const schema = z.object({
  email: z.string().email('Email inválido').nonempty('Campo obrigatório'),
  password: z.string().min(6, 'Senha deve possuir no mínimo 6 caracteres').nonempty('Senha é obrigatória'),
})

type LoginSchema = z.infer<typeof schema>

export const Login: React.FC = () => {
  const { login, loading } = useAuth()
  const [showPassword, setShowPassword] = useState<boolean>(false)
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
              <div className='relative'>
                <Input
                  label='Senha'
                  type='text'
                  inputClassName={showPassword ? '' : 'password-mask'}
                  {...field}
                  autoComplete='off'
                  error={errors.password?.message}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-1 top-[38px] -translate-y-1/2 cursor-pointer text-primary-600 z-10 bg-white p-2'
                >
                  <Icon
                    name={showPassword ? 'EyeOff' : 'Eye'}
                    size={20}
                    color='var(--color-primary-600)'
                    strokeWidth={2.5}
                  />
                </button>
              </div>
            )}
          />

          <Button className='w-full' type='submit' disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
          <Link
            href='/forgot-password'
            className='text-center text-primary-600 font-bold text-sm'
          >
            Esqueci minha senha
          </Link>
        </form>
      </div>
      <div className='mt-auto text-primary-600 font-bold'>
        <Link href={'/store/create'}>Criar programa de fidelidade</Link>
      </div>
    </div>
  )
}
