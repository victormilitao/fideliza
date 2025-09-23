import { Button } from '@/components/button/button'
import { Input } from '@/components/input'
import { Header } from '@/pages/header'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import z from 'zod'
import { createBusinessSchema } from './createBusinessSchema'
import { useUserLoggedIn } from '@/hooks/useUserLoggedIn'
import { useBusiness } from '@/hooks/useBusiness'
import { useOnboardRedirect } from '@/hooks/useOnboardRedirect'

type BusinessFormSchema = z.infer<typeof createBusinessSchema>

export const CreateBusiness: React.FC = () => {
  const { user } = useUserLoggedIn()
  const { createBusiness, createBusinessloading } = useBusiness()
  
  useOnboardRedirect()
  
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<BusinessFormSchema>({
    resolver: zodResolver(createBusinessSchema),
  })

  const handleCreateBusiness = async (data: BusinessFormSchema) => {
    data = { ...data, user_id: user?.id || '' }
    createBusiness(data)
  }

  const handleCreateBusinessError = (error: any) => {
    console.error('Error creating business:', error)
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <div className='flex flex-1 flex-col sm:items-center sm:justify-center sm:pt-0 py-8 px-6'>
        <div className='min-w-64 max-w-xl'>
          <div className='mb-6'>
            <h2 className='text-primary-600 font-bold text-xl'>
              Estamos quase lá!
            </h2>
            <p className='text-primary-600 text-base'>
              Agora, preencha os dados do seu negócio.
            </p>
          </div>
          <form
            onSubmit={handleSubmit(
              handleCreateBusiness,
              handleCreateBusinessError
            )}
            className='flex flex-col gap-4'
          >
            <Controller
              name='name'
              control={control}
              render={({ field }) => (
                <Input
                  label='Nome do estabelecimento'
                  placeholder='Exemplo: Eloop loja'
                  {...field}
                  error={errors.name?.message}
                />
              )}
            />

            <Controller
              name='cnpj'
              control={control}
              render={({ field }) => (
                <Input
                  label='CNPJ'
                  maskType='cnpj'
                  placeholder='00.000.000/0000-00'
                  {...field}
                  error={errors.cnpj?.message}
                />
              )}
            />

            <div className='flex flex-col sm:flex-row gap-4 sm:gap-3'>
              <div className='flex-1 sm:flex-[1]'>
                <Controller
                  name='cep'
                  control={control}
                  render={({ field }) => (
                    <Input
                      label='CEP'
                      maskType='cep'
                      placeholder='00000-000'
                      {...field}
                      error={errors.cep?.message}
                    />
                  )}
                />
              </div>
              <div className='flex-1 sm:flex-[1]'>
                <Controller
                  name='state'
                  control={control}
                  render={({ field }) => (
                    <Input
                      label='Estado'
                      {...field}
                      error={errors.state?.message}
                    />
                  )}
                />
              </div>
            </div>

            <div className='flex flex-col sm:flex-row gap-2 sm:gap-3 mb-5'>
              <div className='flex-1'>
                <Controller
                  name='city'
                  control={control}
                  render={({ field }) => (
                    <Input
                      label='Cidade'
                      {...field}
                      error={errors.city?.message}
                    />
                  )}
                />
              </div>
              <div className='flex-1'>
                <Controller
                  name='neighborhood'
                  control={control}
                  render={({ field }) => (
                    <Input
                      label='Bairro'
                      {...field}
                      error={errors.neighborhood?.message}
                    />
                  )}
                />
              </div>
            </div>

            <div className='flex flex-col sm:flex-row gap-2 sm:gap-3 mb-5'>
              <div className='flex-1 sm:flex-[2]'>
                <Controller
                  name='address'
                  control={control}
                  render={({ field }) => (
                    <Input
                      label='Endereço'
                      {...field}
                      error={errors.address?.message}
                    />
                  )}
                />
              </div>
              <div className='flex-1 sm:flex-[1]'>
                <Controller
                  name='street_number'
                  control={control}
                  render={({ field }) => (
                    <Input
                      label='Número'
                      {...field}
                      error={errors.street_number?.message}
                    />
                  )}
                />
              </div>
            </div>

            <Controller
              name='complement'
              control={control}
              render={({ field }) => (
                <Input
                  label='Complemento'
                  className='mb-5'
                  {...field}
                  error={errors.complement?.message}
                />
              )}
            />

            <Controller
              name='phone'
              control={control}
              render={({ field }) => (
                <Input
                  label='WhatsApp'
                  className='mb-5'
                  maskType='phone'
                  placeholder='(00) 0 0000 0000'
                  {...field}
                  error={errors.phone?.message}
                />
              )}
            />

            <Button
              className='w-full'
              type='submit'
              loading={createBusinessloading}
            >
              Avançar
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
