import Icon from '@/components/icon'
import { Business } from '@/types/business.type'
import { Card } from '@/types/card.type'

type BusinessCardsProps = {
  businesses: Business[] | null | undefined
}

type BusinessStampsProps = {
  card: Card
  stamps_required: number
}

export const BusinessCards = ({ businesses }: BusinessCardsProps) => {
  return (
    <div className='min-w-3xs max-w-lg'>
      {businesses && businesses.length > 0 && (
        <div className='flex flex-col gap-5'>
          {businesses.map((business) => (
            <div
              key={business?.id}
              className='shadow-[0_0_12px_0_#0000001A] bg-white rounded-lg p-4 flex flex-col gap-2'
            >
              <p className='text-sm font-semibold'>{business.name}</p>
              <p className='text-sm text-neutral-600'>{business.address}</p>
              <div className='flex items-center gap-5'>
                {business?.campaigns?.[0].cards?.length
                  ? business?.campaigns?.[0].cards.map((card) => (
                      <div key={card.id}>
                        <BusinessStamps
                          card={card}
                          stamps_required={
                            business?.campaigns?.[0].stamps_required || 0
                          }
                        />
                      </div>
                    ))
                  : 'Sem dados.'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const BusinessStamps = ({
  card,
  stamps_required,
}: BusinessStampsProps) => {
  return (
    <div className='flex items-center gap-2'>
      <div className='fill-icon text-neutral-400'>
        <Icon
          name='TicketCheck'
          color='var(--color-primary-700)'
          fill='var(--color-primary-700)'
        />
      </div>
      <div className='font-bold text-neutral-700'>
        {card?.stamp?.length}/{stamps_required}
      </div>
    </div>
  )
}
