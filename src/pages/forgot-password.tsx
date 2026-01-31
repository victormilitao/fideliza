import React from 'react'
import { Input } from '../components/input'
import { Button } from '../components/button/button'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import api from '@/services/api'
import { useToast } from '@/hooks/useToast'
import { Response } from '@/services/types/api.type'

const schema = z.object({
  email: z.string().email('Email inválido').nonempty('Campo obrigatório'),
})

type ForgotPasswordSchema = z.infer<typeof schema>

export const ForgotPassword: React.FC = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const {
    handleSubmit,
    formState: { errors },
    control,
    setError,
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(schema),
  })

  const { mutate: resetPassword, isPending: loading } = useMutation<
    Response<boolean>,
    Error,
    string
  >({
    mutationFn: async (email: string): Promise<Response<boolean>> => {
      const response = await api.resetPasswordForEmail(email)
      
      if (response.error) {
        // Se houver erro, lançar exceção para ser tratada no onError
        throw response.error instanceof Error
          ? response.error
          : new Error(response.error.message || 'Erro ao enviar email de recuperação.')
      }
      
      // Por questões de segurança, o Supabase sempre retorna sucesso
      // mesmo se o email não existir, então sempre navegamos para a tela de confirmação
      return response
    },
    onSuccess: () => {
      navigate('/forgot-password/check-email')
    },
    onError: (error: unknown) => {
      console.error('Reset password error:', error)
      
      if (error instanceof Error) {
        // Se a mensagem contém informações sobre configuração, mostrar toast também
        if (error.message.includes('configurado no Supabase') || error.message.includes('URL de redirecionamento')) {
          toast.error(error.message)
        }
        setError('email', { 
          message: error.message.includes('configurado no Supabase') 
            ? 'Erro de configuração. Entre em contato com o suporte.'
            : error.message 
        })
      } else {
        toast.error('Ocorreu um erro inesperado. Tente novamente.')
      }
    },
  })

  const handleResetPassword = (data: ForgotPasswordSchema) => {
    resetPassword(data.email)
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-[100dvh] py-10'>
      <h1 className='text-center text-primary-600 font-bold text-2xl mt-10'>
        Eloop
      </h1>
      <div className='flex flex-col gap-6 w-3xs my-auto'>
        <h2 className='text-center text-primary-600 font-bold text-xl'>
          Esqueceu sua senha?
        </h2>
        <p className='text-center text-sm text-neutral-700'>
          Para verificar o seu perfil precisamos do seu e-mail.
        </p>
        <form
          onSubmit={handleSubmit(handleResetPassword)}
          className='flex flex-col gap-6'
        >
          <Controller
            name='email'
            control={control}
            render={({ field }) => (
              <Input
                label='E-mail'
                type='email'
                placeholder='name@email.com'
                {...field}
                error={errors.email?.message}
              />
            )}
          />

          <Button className='w-full' type='submit' disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar'}
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

