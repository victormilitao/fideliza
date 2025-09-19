import { Button } from '@/components/button/button'
import { useBusinessCardsByPerson } from '@/hooks/useBusinessCardsByPerson'
import { useMyBusiness } from '@/hooks/useMyBusiness'
import { Person } from '@/types/person.type'
import { Link, useLocation } from 'react-router-dom'
import { applyMask } from '@/utils/mask-utils'
import { useMyActiveCampaigns } from '@/hooks/useMyActiveCampaigns'
import { CardsRow } from './cards-row'
import { Header } from '@/pages/landing/header'

export const Tickets = () => {
  const location = useLocation()
  const { person }: { person: Person } = location.state?.params || {}
  const { data: businesses } = useBusinessCardsByPerson(person?.id)
  const { business: myBusiness } = useMyBusiness()
  const { campaigns: myCampaigns } = useMyActiveCampaigns(myBusiness?.id || '')

  if (!businesses?.length && !myCampaigns) return null

  const business = businesses?.find(
    (business) => business.id === myBusiness?.id
  )
  const { stamps_required, cards } = business?.campaign || {}
  const maskedPhone = applyMask(person?.phone || '', 'phone')

  const stampsRequired =
    stamps_required || myCampaigns?.[0].stamps_required || 0

  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <div className='flex flex-1 flex-col gap-5 items-center justify-center py-8 overflow-x-hidden'>
        <div className='w-[90%] flex flex-col items-center gap-2'>
          <p className='text-sm mb-3'>Selos de {maskedPhone}</p>
          <CardsRow cards={cards || []} stampsRequired={stampsRequired} />
        </div>
        <div className='mt-5 sm:mt-40'>
          <Link to={'/'}>
            <Button variant='secondary' className='w-3xs'>
              Voltar
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
