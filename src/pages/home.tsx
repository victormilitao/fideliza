import { useNavigate } from 'react-router-dom'
import { Button } from '../components/button/button'
import { Input } from '../components/input'
import { BottomSheet } from '@/components/bottom-sheet'
import { useEffect, useState } from 'react'
import { Reward } from './reward'
import { useSendStampByPhone } from '@/hooks/useSendStampByPhone'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUserByPhone } from '@/hooks/useUserByPhone'
import { useCompletedCard } from '@/hooks/useCompletedCard'
import { useMyBusiness } from '@/hooks/useMyBusiness'
import { Header } from './header'
import { useMyActiveCampaigns } from '@/hooks/useMyActiveCampaigns'

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
  const { business, isLoading: businessLoading } = useMyBusiness()
  const { campaigns, isLoading: myCampaignsLoading } = useMyActiveCampaigns(
    business?.id || ''
  )

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
    sendStamp(data.phone)
    reset()
  }

  const handleGoToTickets = async (data: FormSchema) => {
    const { data: person } = await getUserByPhone(data.phone)
    navigate('/estabelecimento/tickets', {
      state: { params: { person: person } },
    })
    reset()
  }

  useEffect(() => {
    if (!businessLoading && !business) {
      navigate('/estabelecimento/criar-estabelecimento')
    }
  }, [businessLoading, business])

  useEffect(() => {
    if (!myCampaignsLoading && !campaigns) {
      navigate('/estabelecimento/criar-campanha')
    }
  }, [myCampaignsLoading, campaigns])

  return (
    <>
      <Header />
      <div className='flex flex-col items-center justify-center h-screen'>
        <div className='flex flex-col gap-3 w-3xs'>
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
    </>
  )
}
