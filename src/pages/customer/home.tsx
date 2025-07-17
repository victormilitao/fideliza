import { Link } from 'react-router-dom'
import { useLogout } from '@/hooks/useLogout'
import { Button } from '@/components/button/button'
import { useLoggedPerson } from '@/hooks/customer/useLoggedPerson'
import { applyMask } from '@/utils/mask-utils'
import { BusinessCards } from './business-cards'
import { useBusinessCardsByPerson } from '@/hooks/useBusinessCardsByPerson'
import { EmptyStateHome } from './emptyStateHome'

export const Home = () => {
  const { logout } = useLogout()
  const { person } = useLoggedPerson()
  const maskedPhone = applyMask(person?.phone, 'phone')
  const { data: businesses, isLoading } = useBusinessCardsByPerson(person?.id)

  const handleLogout = () => {
    logout()
  }

  if (isLoading) return null

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
      <div className='flex flex-col sm:items-center sm:justify-center sm:h-screen p-4 gap-4 h-screen'>
        <div className='flex flex-col min-w-3xs items-start sm:justify-center'>
          <p className='text-sm'>Meus selos</p>
          <p>{maskedPhone}</p>
        </div>
        {businesses && <BusinessCards businesses={businesses} />}
        {businesses?.length === 0 && <EmptyStateHome />}
      </div>
    </>
  )
}
