import { Button } from '@/components/button/button'
import Icon from '@/components/icon'
import { useBusinessCardsByPerson } from '@/hooks/useBusinessCardsByPerson'
import { useMyBusiness } from '@/hooks/useMyBusiness'
import { Person } from '@/types/person.type'
import { Link, useLocation } from 'react-router-dom'
import { applyMask } from '@/utils/mask-utils'

export const Tickets = () => {
  const location = useLocation()
  const { person }: { person: Person } = location.state?.params || {}
  const { data: businesses } = useBusinessCardsByPerson(person?.id)
  const { business: myBusiness } = useMyBusiness()

  if (!businesses?.length) return null

  const business = businesses.find((business) => business.id === myBusiness?.id)
  const { stamps_required, cards } = business?.campaign || {}
  const maskedPhone = applyMask(person.phone || '', 'phone')

  return (
    <div className='py-8 flex flex-col gap-5 items-center justify-center min-h-screen overflow-x-hidden'>
      <div className='w-[90%] flex flex-col items-center gap-2'>
        <p className='text-sm mb-3'>Selos de {maskedPhone}</p>
        {cards?.map((card, index) => (
          <div className='flex flex-col items-center gap-2' key={card.id}>
            { cards.length > 1 && <p className='text-xl'>Cartela  {index + 1}</p>}
            <p className='text-xl font-bold text-primary-600'>
              {card.stamps.length}/{stamps_required}
            </p>
            <div className='flex flex-wrap gap-7 justify-center'>
              {[...Array(stamps_required)].map((_, index) => (
                <div key={index} className='fill-icon text-neutral-400'>
                  {!card.stamps?.[index] && (
                    <Icon name='Ticket' size={80} strokeWidth={0.7} />
                  )}
                  {card.stamps?.[index] && (
                    <Icon
                      name='TicketCheck'
                      color='var(--color-primary-700)'
                      size={80}
                      fill='var(--color-primary-700)'
                    />
                  )}
                </div>
              ))}
            </div>
            {index < cards.length - 1 && (
              <div className='w-full'>
                <hr className='w-screen -mx-[calc((100vw-100%)/2)] border-t text-neutral-400' />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className='mt-auto sm:mt-60'>
        <Link to={'/'}>
          <Button variant='secondary' className='w-3xs'>
            Voltar
          </Button>
        </Link>
      </div>
    </div>
  )
}
