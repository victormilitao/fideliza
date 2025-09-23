import { Button } from '@/components/button/button'
import { Input } from '@/components/input'
import { Textarea } from '@/components/textarea'
import { Header } from '@/pages/header'
import { BottomSheet } from '@/components/bottom-sheet'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import z from 'zod'
import { createCampaignSchema } from './createCampaignSchema'
import { useMyBusiness } from '@/hooks/useMyBusiness'
import { useCampaign } from '@/hooks/useCampaign'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

type CampaignFormSchema = z.infer<typeof createCampaignSchema>

export const CreateCampaign: React.FC = () => {
  const { business } = useMyBusiness()
  const { createCampaign, createCampaignLoading } = useCampaign()
  const navigate = useNavigate()
  const [showInstructions, setShowInstructions] = useState(false)

  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<CampaignFormSchema>({
    resolver: zodResolver(createCampaignSchema),
    defaultValues: {
      business_id: '',
      stamps_required: 5,
    },
  })

  const handleCreateCampaign = async (data: CampaignFormSchema) => {
    if (!business?.id) {
      console.error('Business not found')
      return
    }

    data = { ...data, business_id: business.id }
    await createCampaign(data)
    localStorage.setItem('showInstructions', 'true')
    navigate('/estabelecimento')
  }

  const handleStart = () => {
    setShowInstructions(false)
    navigate('/estabelecimento')
  }

  const handleCreateCampaignError = (error: any) => {
    console.error('Error creating campaign:', error)
  }

  useEffect(() => {
    if (business?.id) setValue('business_id', business.id)
  }, [business?.id, setValue])

  if (!business?.id) {
    return (
      <div className='flex flex-col min-h-screen'>
        <Header />
        <div className='flex flex-1 items-center justify-center'>
          <p className='text-primary-600'>Carregando estabelecimento...</p>
        </div>
      </div>
    )
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <Header />
      <div className='flex flex-1 justify-center'>
        <div className='w-full sm:max-w-md flex flex-col sm:items-center sm:justify-center flex-1 py-8 sm:pt-0 px-6'>
          <div className='mb-6'>
            <h2 className='text-primary-600 font-bold text-xl'>
              Este é o último passo!
            </h2>
            <p className='text-primary-600 text-base'>
              Defina como será o programa de fidelidade do seu estabelecimento.
            </p>
          </div>
          <form
            onSubmit={handleSubmit(
              handleCreateCampaign,
              handleCreateCampaignError
            )}
            className='flex flex-col gap-2'
          >
            <Controller
              name='rule'
              control={control}
              render={({ field }) => (
                <Textarea
                  label='Como o cliente ganha um selo? (regra)'
                  className='mb-3'
                  placeholder='Exemplo: A cada compra de R$50,00 ou mais, você ganha um selo.'
                  {...field}
                  error={errors.rule?.message}
                />
              )}
            />

            <Controller
              name='prize'
              control={control}
              render={({ field }) => (
                <Textarea
                  label='Qual será o prêmio?'
                  className='mb-5'
                  placeholder='Exemplo: Uma pizza, uma fatia de bolo, um sorvete...'
                  rows={3}
                  {...field}
                  error={errors.prize?.message}
                />
              )}
            />

            <Controller
              name='stamps_required'
              control={control}
              render={({ field }) => (
                <Input
                  label='Quantos selos serão necessários para ganhar o prêmio?'
                  className='mb-5'
                  type='number'
                  placeholder='10'
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  error={errors.stamps_required?.message}
                />
              )}
            />

            <p className='text-primary-600 text-base'>
              <b>Importante:</b> As informações preenchidas acima serão exibidas
              para seus clientes. Mantenha as informações claras e fáceis de
              entender.
            </p>

            <Button
              className='w-full mt-4'
              type='submit'
              loading={createCampaignLoading}
            >
              Criar
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
