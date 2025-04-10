import { Link } from 'react-router-dom'
import { Button } from '../components/button/button'
import { Input } from '../components/input'
import { BottomSheet } from '@/components/bottom-sheet'
import { useState } from 'react'
import { Reward } from './reward'
import { useToast } from '@/hooks/useToast'
import { useNavigate } from 'react-router-dom'
import { useLogout } from '@/hooks/useLogout'

export const Home = () => {
  const [openSheet, setOpenSheet] = useState(false)
  const { success } = useToast()
  const navigate = useNavigate()
  const { logout } = useLogout()

  const handleBonus = () => {
    setOpenSheet(!openSheet)
  }

  const handleSendSticker = () => {
    success('Selo enviado.')
  }

  const handleGoToTickets = () => {
    navigate('/estabelecimento/tickets')
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
          <Input
            className='mb-2'
            label='Celular'
            type='text'
            placeholder='(00) 0 0000-0000'
            maskType='phone'
          />
          <Button onClick={handleSendSticker}>Enviar selos</Button>

          <Button variant='secondary' onClick={handleGoToTickets}>
            Conferir selos
          </Button>

          <Button variant='secondary' onClick={handleBonus}>
            Premiar
          </Button>

          <BottomSheet open={openSheet} onOpenChange={setOpenSheet}>
            <Reward />
          </BottomSheet>
        </div>
      </div>
    </>
  )
}
