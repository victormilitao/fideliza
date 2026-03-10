import { useNavigate } from 'react-router-dom'
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
import { useTrialStatus } from '@/hooks/useTrialStatus'

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
  const navigate = useNavigate()
  const {
    trialStatus,
    stampsSent,
    stampsRemaining,
    totalTrialStamps,
    isSubscribed,
    isLoading: isLoadingTrial,
  } = useTrialStatus()

  useOnboardRedirect()

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: { phone: '' },
  })

  const handleBonus = async (data: FormSchema) => {
    const card = await findCompletedCard(data.phone)
    setCardId(card?.id || '')
    setOpenSheet(!!card)
    reset()
  }

  const handleSendSticker = (data: FormSchema) => {
    sendStamp(data.phone, () => reset())
  }

  const handleGoToTickets = async (data: FormSchema) => {
    const phone = data.phone.replace(/\D/g, '')
    const { data: person } = await getUserByPhone(phone)
    navigate('/estabelecimento/tickets', {
      state: { params: { person: person || { phone } } },
    })
    reset()
  }

  const tabs = [
    { label: 'Enviar selos', href: '/estabelecimento' },
    { label: 'Dados', href: '/estabelecimento/dashboard' },
    { label: 'Pagamento', href: '/estabelecimento/payment' },
  ]

  const isBlocked = trialStatus === 'blocked'

  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <TabNavigation tabs={tabs} />

      <div className='flex flex-1 justify-center'>
        <div className='w-full sm:max-w-md flex flex-col sm:items-center sm:justify-center flex-1 py-8 sm:pt-0 px-6'>
          <div className='flex flex-col gap-3 w-full max-w-sm'>

            {/* Trial Banner - Normal */}
            {!isLoadingTrial && trialStatus === 'normal' && !isSubscribed && (
              <div className='flex items-center justify-between bg-primary-100 border border-primary-300 rounded-sm px-4 py-3 text-sm text-neutral-700'>
                <span>{stampsSent} de {totalTrialStamps} selos enviados.</span>
                <button
                  onClick={() => navigate('/estabelecimento/payment')}
                  className='text-primary-700 font-bold text-sm cursor-pointer ml-2 whitespace-nowrap'
                >
                  Ver plano
                </button>
              </div>
            )}

            {/* Trial Banner - Warning */}
            {!isLoadingTrial && trialStatus === 'warning' && (
              <div className='flex items-center justify-between bg-amber-50 border border-amber-300 rounded-sm px-4 py-3 text-sm text-neutral-700'>
                <span>Restam {stampsRemaining} envios no teste gratuito.</span>
                <button
                  onClick={() => navigate('/estabelecimento/payment')}
                  className='text-primary-700 font-bold text-sm cursor-pointer ml-2 whitespace-nowrap'
                >
                  Ver plano
                </button>
              </div>
            )}

            {/* Trial Banner - Blocked */}
            {!isLoadingTrial && isBlocked && (
              <div className='bg-primary-600 rounded-xl p-5 flex flex-col gap-3 text-neutral-100'>
                <p className='text-base font-bold'>
                  Você utilizou os {totalTrialStamps} selos do seu teste gratuito.
                </p>
                <p className='text-sm'>
                  Continue utilizando o Eloop para fidelizar e premiar seus clientes.
                </p>
                <Button
                  variant='secondary'
                  className='bg-neutral-100 text-primary-600 border-primary-600'
                  onClick={() => navigate('/estabelecimento/contratar')}
                >
                  Continuar enviando selos
                </Button>
              </div>
            )}

            <Controller
              name='phone'
              control={control}
              rules={{ required: 'Campo obrigatório' }}
              render={({ field }) => (
                <Input
                  className='mb-2'
                  label='Celular'
                  type='tel'
                  placeholder='(00) 0 0000 0000'
                  maskType='phone'
                  {...field}
                  error={errors.phone?.message}
                />
              )}
            />

            <Button
              onClick={handleSubmit(handleSendSticker)}
              loading={sendStampLoading}
              disabled={isBlocked}
              className={isBlocked ? 'opacity-50 cursor-not-allowed' : ''}
            >
              Enviar selo
            </Button>

            <Button variant='secondary' onClick={handleSubmit(handleGoToTickets)}>
              Conferir selos
            </Button>

            <Button variant='secondary' onClick={handleSubmit(handleBonus)}>
              Premiar
            </Button>

            <BottomSheet open={openSheet} onOpenChange={setOpenSheet}>
              <Reward cardId={cardId} closeSheet={() => setOpenSheet(false)} />
            </BottomSheet>
          </div>
        </div>
      </div>

      <CampaignInstructionsBottomSheet />
    </div>
  )
}

