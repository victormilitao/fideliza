import { Button } from '@/components/button/button'
import Icon from '@/components/icon'
import { useBusinessCardsByPerson } from '@/hooks/useBusinessCardsByPerson'
import { Link, useLocation } from 'react-router-dom'
import { applyMask } from '@/utils/mask-utils'
import { useLoggedPerson } from '@/hooks/customer/useLoggedPerson'
import { BusinessCard } from './business-card'
import { CampaignRules } from './campaign-rules'

export const Tickets = () => {
  const location = useLocation()
  const { businessId }: { businessId: string } = location.state?.params || {}
  const { person } = useLoggedPerson()
  const { data: businesses } = useBusinessCardsByPerson(person?.id)

  if (!businesses?.length && !businessId) return null

  const business = businesses?.find((business) => business.id === businessId)
  const { stamps_required, cards } = business?.campaign || {}
  const maskedPhone = applyMask(person?.phone, 'phone')

  return (
    <div className='py-8 flex flex-col gap-5 items-center justify-center min-h-screen'>
      <div className='w-[90%] flex flex-col items-center gap-2'>
        <div className='min-w-3xs max-w-lg'>
          <p className='text-sm'>Meus selos</p>
          <p>{maskedPhone}</p>
        </div>
        <BusinessCard business={business || {}}>
          <CampaignRules campaign={business?.campaign || {}} />
        </BusinessCard>
        {cards?.map((card, index) => (
          <div className='flex flex-col items-center gap-2' key={card.id}>
            <p className='text-xl'>Cartela {index + 1}</p>
            {card.completed_at && (
              <div>
                <Icon
                  name='PartyPopper'
                  color='var(--color-primary-500)'
                  size={40}
                />
              </div>
            )}
            <p className='text-xl font-bold text-primary-600'>
              {card.stamp.length}/{stamps_required}
            </p>
            <div className='flex flex-wrap gap-7 justify-center'>
              {[...Array(stamps_required)].map((_, index) => (
                <div key={index} className='fill-icon text-neutral-400'>
                  {!card.stamp?.[index] && (
                    <Icon name='Ticket' size={80} strokeWidth={0.7} />
                  )}
                  {card.stamp?.[index] && (
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
              <div className='relative w-full'>
                <hr className='absolute -left-full -right-full border-t text-neutral-400' />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className='mt-auto sm:mt-60'>
        <Link to={'/usuario'}>
          <Button variant='secondary' className='w-3xs'>
            Voltar
          </Button>
        </Link>
      </div>
    </div>
  )
}
