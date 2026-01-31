import React, { useState, useEffect } from 'react'
import { Input } from '../components/input'
import { Button } from '../components/button/button'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import api from '@/services/api'
import { useToast } from '@/hooks/useToast'
import { Response } from '@/services/types/api.type'
import Icon from '../components/icon'

const schema = z
  .object({
    password: z
      .string()
      .min(8, 'Sua senha deve ter no mínimo 8 caracteres')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Sua senha deve ter letras maiúsculas e minúsculas, números e símbolos'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem.',
    path: ['confirmPassword'],
  })

type ResetPasswordSchema = z.infer<typeof schema>

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const toast = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [token, setToken] = useState<string | null>(null)

  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    // Buscar token da URL
    const urlToken = searchParams.get('token')
    
    if (!urlToken) {
      toast.error('Link inválido. Token não encontrado.')
      navigate('/login')
      return
    }

    setToken(urlToken)
  }, [searchParams, navigate, toast])

  const { mutate: updatePassword, isPending: loading } = useMutation<
    Response<boolean>,
    Error,
    string
  >({
    mutationFn: async (password: string): Promise<Response<boolean>> => {
      if (!token) {
        throw new Error('Token inválido')
      }
      
      const response = await api.updatePassword(password, token)
      if (response.error) {
        throw new Error(response.error.message || 'Erro ao atualizar senha. Tente novamente.')
      }
      return response
    },
    onSuccess: () => {
      navigate('/reset-password/success')
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Ocorreu um erro inesperado. Tente novamente.')
      }
    },
  })

  const handleResetPassword = (data: ResetPasswordSchema) => {
    updatePassword(data.password)
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-[100dvh] py-10'>
      <h1 className='text-center text-primary-600 font-bold text-2xl mt-10'>
        Eloop
      </h1>
      <div className='flex flex-col gap-6 w-3xs my-auto'>
        <h2 className='text-center text-primary-600 font-bold text-xl'>
          Crie nova senha
        </h2>
        <form
          onSubmit={handleSubmit(handleResetPassword)}
          className='flex flex-col gap-6'
        >
          <div className='relative'>
            <Controller
              name='password'
              control={control}
              render={({ field }) => (
                <Input
                  label='Nova senha'
                  type={showPassword ? 'text' : 'password'}
                  {...field}
                  error={errors.password?.message}
                />
              )}
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-3 top-[calc(1.25rem+1rem)] text-neutral-600 flex items-center justify-center h-10'
            >
              <Icon
                name={showPassword ? 'EyeOff' : 'Eye'}
                size={20}
                color='var(--color-neutral-600)'
              />
            </button>
          </div>

          <div className='relative'>
            <Controller
              name='confirmPassword'
              control={control}
              render={({ field }) => (
                <Input
                  label='Confirmar nova senha'
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...field}
                  error={errors.confirmPassword?.message}
                />
              )}
            />
            <button
              type='button'
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className='absolute right-3 top-[calc(1.25rem+1rem)] text-neutral-600 flex items-center justify-center h-10'
            >
              <Icon
                name={showConfirmPassword ? 'EyeOff' : 'Eye'}
                size={20}
                color='var(--color-neutral-600)'
              />
            </button>
          </div>

          <p className='text-sm text-neutral-700'>
            Sua senha deve ter no mínimo 8 caracteres, com letras maiúsculas e
            minúsculas, números e símbolos.
          </p>

          <Button className='w-full' type='submit' disabled={loading || !token}>
            {loading ? 'Redefinindo...' : 'Redefinir'}
          </Button>
        </form>
        <Link
          to='/login'
          className='text-center text-primary-600 font-bold text-sm'
        >
          Cancelar
        </Link>
      </div>
    </div>
  )
}

