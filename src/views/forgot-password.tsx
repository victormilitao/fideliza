import React from 'react'
import { Input } from '@/components/input'
import { Button } from '@/components/button/button'
import { useForgotPassword } from '@/hooks/useForgotPassword'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'

const schema = z.object({
  email: z.string().email('Email inválido').nonempty('Campo obrigatório'),
})

type ForgotPasswordSchema = z.infer<typeof schema>

export const ForgotPassword: React.FC = () => {
  const { sendResetEmail, loading } = useForgotPassword()
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(schema),
  })

  const handleSendEmail = (data: ForgotPasswordSchema) => {
    sendResetEmail(data.email)
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-[100dvh] py-10'>
      <h1 className='text-center text-primary-600 font-bold text-2xl md:text-3xl mt-10'>
        Fideliza
      </h1>
      <div className='flex flex-col gap-6 w-[90%] max-w-xs my-auto'>
        <div className='flex flex-col gap-2'>
          <h2 className='text-primary-600 font-bold text-xl'>
            Esqueceu sua senha?
          </h2>
          <p className='text-neutral-700 text-sm'>
            Informe seu e-mail cadastrado no Fideliza e enviaremos um link para
            você redefinir sua senha.
          </p>
        </div>
        <form
          onSubmit={handleSubmit(handleSendEmail)}
          className='flex flex-col gap-6'
        >
          <Controller
            name='email'
            control={control}
            render={({ field }) => (
              <Input
                label='E-mail'
                type='email'
                {...field}
                error={errors.email?.message}
              />
            )}
          />

          <div className='flex flex-col gap-3'>
            <Button className='w-full' type='submit' disabled={loading} loading={loading}>
              Enviar
            </Button>
            <Link href='/login'>
              <Button className='w-full' type='button' variant='secondary'>
                Voltar
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
