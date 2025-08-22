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
import { useState } from 'react'

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
  } = useForm<CampaignFormSchema>({
    resolver: zodResolver(createCampaignSchema),
    defaultValues: {
      business_id: business?.id || '',
      stamps_required: 10,
    },
  })

  const handleCreateCampaign = async (data: CampaignFormSchema) => {
    if (!business?.id) {
      console.error('Business not found')
      return
    }

    data = { ...data, business_id: business.id }
    await createCampaign(data)
    setShowInstructions(true)
  }

  const handleStart = () => {
    setShowInstructions(false)
    navigate('/estabelecimento')
  }

  const handleCreateCampaignError = (error: any) => {
    console.error('Error creating campaign:', error)
  }

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
              className='w-full'
              type='submit'
              loading={createCampaignLoading}
            >
              Criar
            </Button>
          </form>
        </div>
              </div>
        <BottomSheet open={showInstructions} onOpenChange={setShowInstructions}>
          <div className='flex flex-col gap-6'>
            <div className='text-center'>
              <h2 className='text-2xl font-bold text-primary-600 mb-2'>
                Muito bom!
              </h2>
              <p className='text-primary-600 text-lg'>
                Seu programa de fidelidade está pronto.
              </p>
            </div>
            
            <div>
              <h3 className='font-bold text-primary-600 mb-4'>
                Entenda como funciona:
              </h3>
              <div className='space-y-3'>
                <div className='flex gap-3'>
                  <span className='flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold'>
                    1
                  </span>
                  <p className='text-primary-600 text-sm'>
                    Informe o número de celular do seu cliente para enviar um selo.
                  </p>
                </div>
                <div className='flex gap-3'>
                  <span className='flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold'>
                    2
                  </span>
                  <p className='text-primary-600 text-sm'>
                    O cliente receberá um SMS com o selo e um link para acompanhar o progresso dele.
                  </p>
                </div>
                <div className='flex gap-3'>
                  <span className='flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold'>
                    3
                  </span>
                  <p className='text-primary-600 text-sm'>
                    Ao atingir a quantidade de selos necessária para ser premiado, o cliente receberá um SMS com um código de premiação.
                  </p>
                </div>
                <div className='flex gap-3'>
                  <span className='flex-shrink-0 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold'>
                    4
                  </span>
                  <p className='text-primary-600 text-sm'>
                    No momento do resgate do prêmio, o cliente deve informar o código de premiação. Acesse a função "Premiar", insira o código, e os selos serão zerados para que ele possa começar um novo ciclo.
                  </p>
                </div>
              </div>
            </div>
            
            <Button onClick={handleStart} className='w-full'>
              Começar
            </Button>
          </div>
        </BottomSheet>
      </div>
  )
}
