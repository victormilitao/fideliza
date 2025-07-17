import Icon from '@/components/icon'
import { Stamp } from '@/types/stamp.type'

interface StampsRowProps {
  stampsRequired: number
  stamps: Stamp[]
}

export const StampsRow = ({ stampsRequired, stamps }: StampsRowProps) => (
  <div className='flex flex-wrap gap-7 justify-center'>
    {[...Array(stampsRequired)].map((_, index) => (
      <div key={index} className='fill-icon text-neutral-400'>
        {!stamps?.[index] ? (
          <Icon name='Ticket' size={80} strokeWidth={0.7} />
        ) : (
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
)
