import Icon from '@/components/icon'
import { Card as CardType } from '@/types/card.type'
import { PrizeCode } from './prize-code'

type CardProps = {
  index?: number
  card: CardType
  stampsRequired: number
}

export const Card = ({ index, card, stampsRequired }: CardProps) => {
  return (
    <div className='flex flex-col items-center gap-2 my-5' key={card.id}>
      {index && <p className='text-xl'>Cartela {index}</p>}
      {card.completed_at && (
        <div>
          <Icon name='PartyPopper' color='var(--color-primary-500)' size={40} />
        </div>
      )}
      <p className='text-xl font-bold text-primary-600'>
        {card.stamps.length}/{stampsRequired}
      </p>
      {card.completed_at && (
        <>
          <p className='text-base text-neutral-700 font-bold'>Parabéns!</p>
          <p className='text-sm text-neutral-700'>
            Você já pode resgatar seu prêmio.
          </p>
          {card.prize_code && <PrizeCode prizeCode={card.prize_code} />}
        </>
      )}
      <div className='flex flex-wrap gap-7 justify-center'>
        {[...Array(stampsRequired)].map((_, index) => (
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
    </div>
  )
}
