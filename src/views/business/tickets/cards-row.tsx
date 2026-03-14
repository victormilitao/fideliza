import { StampsRow } from './stamps-row'
import { Card } from '@/types/card.type'

type CardsRowProps = {
  cards: Card[]
  stampsRequired: number
}

export const CardsRow = ({ cards, stampsRequired }: CardsRowProps) => {
  if (!cards?.length) cards = [{ id: 'empty', stamps: [] }]
  return (
    <div className='flex flex-col items-center gap-2'>
      {cards.map((card, index) => (
        <div className='flex flex-col items-center gap-2' key={card.id}>
          {cards.length > 1 && <p className='text-xl'>Cartela {index + 1}</p>}
          <p className='text-xl font-bold text-primary-600'>
            {card.stamps.length}/{stampsRequired}
          </p>
          <StampsRow
            stamps={card.stamps}
            stampsRequired={stampsRequired || 0}
          />
          {index < cards.length - 1 && (
            <div className='w-full mb-5'>
              <hr className='w-screen -mx-[calc((100vw-100%)/2)] border-t text-neutral-400' />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
