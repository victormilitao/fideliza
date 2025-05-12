import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/button/button'
import { Input } from '../components/input'
import { BottomSheet } from '@/components/bottom-sheet'
import { useState } from 'react'
import { Reward } from './reward'
import { useLogout } from '@/hooks/useLogout'
import { useSendStampByPhone } from '@/hooks/useSendStampByPhone'
import { useForm, Controller } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUserByPhone } from '@/hooks/useUserByPhone'
import { useCompletedCard } from '@/hooks/useCompletedCard'

const schema = z.object({
  phone: z.string().nonempty('Campo obrigatório'),
})
type FormSchema = z.infer<typeof schema>

export const Home = () => {
  const [openSheet, setOpenSheet] = useState(false)
  const { logout } = useLogout()
  const { sendStamp } = useSendStampByPhone()
  const { getUserByPhone } = useUserByPhone()
  const [cardId, setCardId] = useState<string>('')
  const { findCompletedCard } = useCompletedCard()
  const navigate = useNavigate()
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: { phone: '' },
  })

  const handleBonus = async (data: FormSchema) => {
    const card = await findCompletedCard(data.phone)
    setCardId(card?.id || '')
    setOpenSheet(!!card)
  }

  const handleSendSticker = (data: FormSchema) => {
    sendStamp(data.phone)
  }

  const handleGoToTickets = async (data: FormSchema) => {
    const { data: person } = await getUserByPhone(data.phone)
    navigate('/estabelecimento/tickets', {
      state: { params: { person: person } },
    })
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <>
      <div className='p-4 absolute w-full flex justify-end'>
        <div className='right-0'>
          <Link to={'/estabelecimento/login'}>
            <Button variant='link' onClick={handleLogout}>
              Sair
            </Button>
          </Link>
        </div>
      </div>
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
                placeholder='(00) 0 0000-0000'
                maskType='phone'
                {...field}
                error={errors.phone?.message}
              />
            )}
          />

          <Button onClick={handleSubmit(handleSendSticker)}>Enviar selo</Button>

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
