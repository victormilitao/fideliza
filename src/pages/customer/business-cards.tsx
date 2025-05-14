import Icon from '@/components/icon'
import { Card } from '@/types/card.type'
import { Stamp } from '@/types/stamp.type'

type BusinessCardsProps = {
  stamps?: Stamp[] | null | undefined
  cards?: Card[] | null | undefined
}

//pegar o business pela campanha

export const BusinessCards = ({ cards }: BusinessCardsProps) => {
  return (
    <div className='shadow-sm bg-white rounded-lg p-4'>
      <div className='flex items-center gap-5'>
        {cards?.length
          ? cards.map((card) => (
              <div key={card.id}>
                <BusinessStamps stamps={card?.stamp} />
              </div>
            ))
          : 'Sem dados.'}
      </div>
    </div>
  )
}

export const BusinessStamps = ({ stamps }: BusinessCardsProps) => {
  return (
    <div className='flex items-center gap-2'>
      <div className='fill-icon text-neutral-400'>
        <Icon
          name='TicketCheck'
          color='var(--color-primary-700)'
          fill='var(--color-primary-700)'
        />
      </div>
      <div>{stamps?.length}/10</div>
    </div>
  )
}
