import React, { useState } from 'react'
import { Input } from '@/components/input'
import { Button } from '@/components/button/button'
import { useResetPassword } from '@/hooks/useResetPassword'
import { useToast } from '@/hooks/useToast'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import Icon from '@/components/icon'

const schema = z
  .object({
    password: z
      .string()
      .min(6, 'Senha deve possuir no mínimo 6 caracteres')
      .nonempty('Campo obrigatório'),
    confirmPassword: z.string().nonempty('Campo obrigatório'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas digitadas são diferentes.',
    path: ['confirmPassword'],
  })

type ResetPasswordSchema = z.infer<typeof schema>

export const ResetPassword: React.FC = () => {
  const { updatePassword, loading } = useResetPassword()
  const toast = useToast()
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(schema),
  })

  const handleResetPassword = (data: ResetPasswordSchema) => {
    if (data.password !== data.confirmPassword) {
      toast.error('As senhas digitadas são diferentes.')
      return
    }
    updatePassword(data.password)
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-[100dvh] py-10'>
      <h1 className='text-center text-primary-600 font-bold text-2xl md:text-3xl mt-10'>
        Fideliza
      </h1>
      <div className='flex flex-col gap-6 w-[90%] max-w-xs my-auto'>
        <h2 className='text-primary-600 font-bold text-xl'>
          Crie sua nova senha
        </h2>
        <form
          onSubmit={handleSubmit(handleResetPassword)}
          className='flex flex-col gap-6'
        >
          <Controller
            name='password'
            control={control}
            render={({ field }) => (
              <div className='relative'>
                <Input
                  label='Nova senha'
                  type={showPassword ? 'text' : 'password'}
                  {...field}
                  error={errors.password?.message}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-[34px] cursor-pointer text-neutral-500'
                >
                  <Icon
                    name={showPassword ? 'EyeOff' : 'Eye'}
                    size={18}
                    color='var(--color-neutral-500)'
                  />
                </button>
              </div>
            )}
          />

          <Controller
            name='confirmPassword'
            control={control}
            render={({ field }) => (
              <div className='relative'>
                <Input
                  label='Repita a nova senha'
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...field}
                  error={errors.confirmPassword?.message}
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className='absolute right-3 top-[34px] cursor-pointer text-neutral-500'
                >
                  <Icon
                    name={showConfirmPassword ? 'EyeOff' : 'Eye'}
                    size={18}
                    color='var(--color-neutral-500)'
                  />
                </button>
              </div>
            )}
          />

          <Button className='w-full' type='submit' disabled={loading} loading={loading}>
            Salvar nova senha
          </Button>
        </form>
      </div>
      <div className='mt-auto text-primary-600 font-bold'>
        <Link href='/login'>Acessar minha conta</Link>
      </div>
    </div>
  )
}
