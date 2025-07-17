import { Button } from '@/components/button/button'
import { useBusinessCardsByPerson } from '@/hooks/useBusinessCardsByPerson'
import { useMyBusiness } from '@/hooks/useMyBusiness'
import { Person } from '@/types/person.type'
import { Link, useLocation } from 'react-router-dom'
import { applyMask } from '@/utils/mask-utils'
import { StampsRow } from './stamps-row'

export const Tickets = () => {
  const location = useLocation()
  const { person }: { person: Person } = location.state?.params || {}
  const { data: businesses } = useBusinessCardsByPerson(person?.id)
  const { business: myBusiness } = useMyBusiness()

  if (!businesses?.length) return null

  const business = businesses.find((business) => business.id === myBusiness?.id)
  const { stamps_required, cards } = business?.campaign || {}
  const maskedPhone = applyMask(person.phone || '', 'phone')
  console.dir(cards)
  return (
    <div className='py-8 flex flex-col gap-5 items-center justify-center min-h-screen overflow-x-hidden'>
      <div className='w-[90%] flex flex-col items-center gap-2'>
        <p className='text-sm mb-3'>Selos de {maskedPhone}</p>
        {cards?.map((card, index) => (
          <div className='flex flex-col items-center gap-2' key={card.id}>
            {cards.length > 1 && <p className='text-xl'>Cartela {index + 1}</p>}
            <p className='text-xl font-bold text-primary-600'>
              {card.stamps.length}/{stamps_required}
            </p>
            <div className='flex flex-wrap gap-7 justify-center'>
              <StampsRow
                stamps={card.stamps}
                stampsRequired={stamps_required || 0}
              />
            </div>
            {index < cards.length - 1 && (
              <div className='w-full mb-5'>
                <hr className='w-screen -mx-[calc((100vw-100%)/2)] border-t text-neutral-400' />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className='mt-5 sm:mt-40'>
        <Link to={'/'}>
          <Button variant='secondary' className='w-3xs'>
            Voltar
          </Button>
        </Link>
      </div>
    </div>
  )
}
