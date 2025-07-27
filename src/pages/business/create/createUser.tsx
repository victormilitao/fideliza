import { Button } from '@/components/button/button'
import { Input } from '@/components/input'
import { useBusiness } from '@/hooks/useBusiness'
import { Header } from '@/pages/header'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import z from 'zod'

const schema = z.object({
  email: z.string().email('Email inválido'), //.nonempty('Email é obrigatório'),
  password: z
    .string()
    .min(6, 'Senha deve possuir no mínimo 6 caracteres')
    .nonempty('Senha é obrigatória'),
})

type CreateBusinessSchema = z.infer<typeof schema>

export const CreateUser: React.FC = () => {
  const { createUser, loading } = useBusiness()
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<CreateBusinessSchema>({
    resolver: zodResolver(schema),
  })

  const handleCreateUser = async (data: CreateBusinessSchema) => {
    const { email, password } = data
    createUser({ email, password })
  }

  return (
    <>
      <Header />
      <div className='flex flex-col sm:items-center justify-center min-h-full py-8 px-6 min-w-64 mx-auto'>
        <div className='mb-10'>
          <h2 className='text-primary-600 font-bold text-xl'>Bem-vindo!</h2>
          <p className='text-primary-600 font-bold'>
            Vamos criar seu programa de fidelidade.
          </p>
        </div>
        <div className='flex flex-col gap-6 my-auto'>
          <form
            onSubmit={handleSubmit(handleCreateUser)}
            className='flex flex-col gap-2'
          >
            <p className='mb-'>
              Qual <span className='text-primary-600 font-bold'>e-mail</span>{' '}
              você quer usar para acessar o Fideliza?
            </p>
            <Controller
              name='email'
              control={control}
              render={({ field }) => (
                <Input
                  type='email'
                  className='mb-3'
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
                  label='Crie uma senha'
                  type='password'
                  className='mb-5'
                  {...field}
                  error={errors.password?.message}
                />
              )}
            />

            <Button className='w-full' type='submit' loading={loading}>
              Avançar
            </Button>
          </form>
        </div>
      </div>
    </>
  )
}
