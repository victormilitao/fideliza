import { Link, useNavigate } from 'react-router-dom'
import { useLogout } from '@/hooks/useLogout'
import { Button } from '@/components/button/button'
import { useLoggedPerson } from '@/hooks/customer/useLoggedPerson'
import { applyMask } from '@/utils/mask-utils'
import { BusinessCards } from './business-cards'
import { useCardsByPerson } from '@/hooks/useCardsByPerson'

export const Home = () => {
  const { logout } = useLogout()
  const { person } = useLoggedPerson()
  const maskedPhone = applyMask(person?.phone, 'phone')
  const navigate = useNavigate()
  const { data: cards } = useCardsByPerson(person?.id)

  const handleGoToTickets = () => {
    navigate('/estabelecimento/tickets', {
      // state: { params: { person: person } },
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
        <div>
          <p className='text-sm'>Meus selos</p>
          <p>{maskedPhone}</p>
          <BusinessCards cards={cards} />
        </div>
      </div>
    </>
  )
}
