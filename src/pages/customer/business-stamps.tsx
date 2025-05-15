import Icon from '@/components/icon'
import { Card } from '@/types/card.type'

type BusinessStampsProps = {
  card: Card
  stamps_required: number
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
