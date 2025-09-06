import { Header } from '@/pages/landing/header'
import { useLoggedPerson } from '@/hooks/customer/useLoggedPerson'
import { applyMask } from '@/utils/mask-utils'
import { BusinessCards } from './business-cards'
import { useBusinessCardsByPerson } from '@/hooks/useBusinessCardsByPerson'
import { EmptyStateHome } from './emptyStateHome'

export const Home = () => {
  const { person } = useLoggedPerson()
  const maskedPhone = applyMask(person?.phone, 'phone')
  const { data: businesses, isLoading } = useBusinessCardsByPerson(person?.id)

  if (isLoading) return null

    return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <div className='flex flex-col sm:items-center sm:justify-center flex-1 p-4 gap-4'>
        <div className='flex flex-col min-w-3xs items-start sm:justify-center'>
          <p className='text-sm'>Meus selos</p>
          <p>{maskedPhone}</p>
        </div>
        {businesses && <BusinessCards businesses={businesses} />}
        {businesses?.length === 0 && <EmptyStateHome />}
      </div>
    </div>
  )
}
