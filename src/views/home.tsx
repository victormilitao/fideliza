import { useRouter } from 'next/navigation'
import { Button } from '../components/button/button'
import { Input } from '../components/input'
import { BottomSheet } from '@/components/bottom-sheet'
import { TabNavigation } from '@/components/business/tab-navigation'
import { CampaignInstructionsBottomSheet } from '@/components/business/campaign-instructions-bottom-sheet'
import { useState } from 'react'
import { Reward } from './reward'
import { useSendStampByPhone } from '@/hooks/useSendStampByPhone'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUserByPhone } from '@/hooks/useUserByPhone'
import { useCompletedCard } from '@/hooks/useCompletedCard'
import { Header } from './header'
import { useOnboardRedirect } from '@/hooks/useOnboardRedirect'
import { useBusinessSubscription } from '@/hooks/useBusinessSubscription'
import { useMyBusiness } from '@/hooks/useMyBusiness'
import { useTotalStamps } from '@/hooks/useTotalStamps'


const schema = z.object({
  phone: z.string().nonempty('Campo obrigatório'),
})
type FormSchema = z.infer<typeof schema>

export const Home = () => {
  const [openSheet, setOpenSheet] = useState(false)
  const { sendStamp, loading: sendStampLoading } = useSendStampByPhone()
  const { getUserByPhone } = useUserByPhone()
  const [cardId, setCardId] = useState<string>('')
  const { findCompletedCard } = useCompletedCard()
  const router = useRouter()

  const { business } = useMyBusiness()
  const { subscription } = useBusinessSubscription(business?.id)
  const { totalStamps, refetch: refetchStamps } = useTotalStamps(business?.id)

  const isSubscribed = subscription?.status === 'complete' || subscription?.status === 'active'

  const { isLoading: onboardLoading } = useOnboardRedirect()

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: { phone: '' },
  })

  if (onboardLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  const handleBonus = async (data: FormSchema) => {
    const card = await findCompletedCard(data.phone)
    setCardId(card?.id || '')
    setOpenSheet(!!card)
    reset()
  }

  const handleSendSticker = (data: FormSchema) => {
    const stampsCount = totalStamps || 0

    if (!isSubscribed && stampsCount >= 50) {
      return
    }

    sendStamp(data.phone, () => {
      refetchStamps()
      reset()
    })
  }

  const handleGoToTickets = async (data: FormSchema) => {
    const phone = data.phone.replace(/\D/g, '')
    await getUserByPhone(phone)
    router.push(`/store/tickets?phone=${phone}`)
    reset()
  }

  const tabs = [
    { label: 'Enviar selos', href: '/' },
    { label: 'Dados', href: '/store/dashboard' },
  ]

  const stampsCount: number = totalStamps || 0
  const hasReachedLimit: boolean = !isSubscribed && stampsCount >= 50
  const remaining: number = 50 - stampsCount
  const isLow: boolean = !isSubscribed && remaining <= 10 && remaining > 0

  return (
    <div className='min-h-screen flex flex-col'>
      <div className="bg-white">
        <Header />
        <div className="hidden sm:block">
          <TabNavigation tabs={tabs} />
        </div>
      </div>

      <div className='flex flex-1 justify-center items-center px-0 sm:px-6 sm:py-12'>
        <div className='w-full sm:max-w-md flex flex-col items-center justify-center'>

          <div className={`bg-white sm:shadow-[0px_0px_30px_0px_rgba(0,0,0,0.1)] w-full ${
            hasReachedLimit ? 'sm:rounded-t-[12px]' : 'sm:rounded-[12px] sm:overflow-hidden'
          }`}>
            <div className='px-8 pt-10 pb-6 sm:px-20 sm:pt-20 sm:pb-16'>
              <div className='flex flex-col gap-3 w-full'>
                <Controller
                  name='phone'
                  control={control}
                  rules={{ required: 'Campo obrigatório' }}
                  render={({ field }) => (
                    <Input
                      label='Celular'
                      type='tel'
                      placeholder='(00) 0 0000 0000'
                      maskType='phone'
                      {...field}
                      error={errors.phone?.message}
                    />
                  )}
                />

                {!hasReachedLimit && (
                  <Button
                    onClick={handleSubmit(handleSendSticker)}
                    loading={sendStampLoading}
                  >
                    Enviar selo
                  </Button>
                )}

                <Button variant='secondary' onClick={handleSubmit(handleGoToTickets)}>
                  Conferir selos
                </Button>

                <Button variant='secondary' onClick={handleSubmit(handleBonus)}>
                  Premiar
                </Button>
              </div>
            </div>

            {/* Desktop inline banner */}
            {!isSubscribed && !hasReachedLimit && (
              <div className={`hidden sm:flex py-4 items-center justify-center gap-1 ${
                isLow ? 'bg-warning-100' : 'bg-gray-100'
              }`}>
                <span className={`text-sm ${
                  isLow ? 'text-neutral-800' : 'text-neutral-700'
                }`}>
                  {isLow
                    ? <>Restam <strong>{remaining}</strong> envios no teste gratuito.</>
                    : <>{stampsCount} de 50 selos enviados.</>
                  }
                </span>
                <Button
                  variant="link"
                  onClick={() => router.push('/store/payment')}
                  className={`p-0 h-auto text-sm hover:underline ${
                    isLow ? 'text-neutral-800 font-bold' : 'text-black font-bold'
                  }`}
                >
                  Ver plano
                </Button>
              </div>
            )}
          </div>

          {/* Desktop inline limit section */}
          {hasReachedLimit && (
            <div className="hidden sm:flex bg-primary-600 sm:rounded-b-[12px] w-full px-6 py-10 sm:px-10 sm:-mt-[10px] flex-col gap-6">
              <div className="flex flex-col gap-2">
                <h3 className="text-base font-bold text-white">
                  Você utilizou os 50 selos do seu teste gratuito.
                </h3>
                <p className="text-sm text-white">
                  Continue utilizando o Eloop para fidelizar e premiar seus clientes.
                </p>
              </div>
              <Button
                className="w-full text-primary-600 border border-primary-600"
                variant="secondary"
                onClick={() => router.push('/store/payment')}
              >
                Continuar enviando selos
              </Button>
            </div>
          )}

          <BottomSheet open={openSheet} onOpenChange={setOpenSheet}>
            <Reward cardId={cardId} closeSheet={() => setOpenSheet(false)} />
          </BottomSheet>
        </div>
      </div>

      {/* Mobile fixed bottom banner */}
      {!isSubscribed && !hasReachedLimit && (
        <div className={`sm:hidden fixed bottom-0 left-0 right-0 py-4 flex items-center justify-center gap-1 z-10 ${
          isLow ? 'bg-warning-100' : 'bg-gray-100'
        }`}>
          <span className={`text-sm ${
            isLow ? 'text-neutral-800' : 'text-neutral-700'
          }`}>
            {isLow
              ? <>Restam <strong>{remaining}</strong> envios no teste gratuito.</>
              : <>{stampsCount} de 50 selos enviados.</>
            }
          </span>
          <Button
            variant="link"
            onClick={() => router.push('/store/payment')}
            className={`p-0 h-auto text-sm hover:underline ${
              isLow ? 'text-neutral-800 font-bold' : 'text-black font-bold'
            }`}
          >
            Ver plano
          </Button>
        </div>
      )}

      {/* Mobile fixed bottom limit section */}
      {hasReachedLimit && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-primary-600 w-full px-6 py-8 flex flex-col gap-6 z-10 rounded-t-2xl">
          <div className="flex flex-col gap-2">
            <h3 className="text-base font-bold text-white">
              Você utilizou os 50 selos do seu teste gratuito.
            </h3>
            <p className="text-sm text-white">
              Continue utilizando o Eloop para fidelizar e premiar seus clientes.
            </p>
          </div>
          <Button
            className="w-full text-primary-600 border border-primary-600"
            variant="secondary"
            onClick={() => router.push('/store/payment')}
          >
            Continuar enviando selos
          </Button>
        </div>
      )}

      <CampaignInstructionsBottomSheet />
    </div>
  )
}
