import { Button } from '@/components/button/button'
import Icon from '@/components/icon'
import { Link } from 'react-router-dom'

export const Tickets = () => {
  const tickets = [
    { id: 1, date: '2023-10-01', checked: true },
    { id: 2, date: '2023-10-01', checked: true },
    { id: 3, date: '2023-10-01', checked: true },
    { id: 4, date: '2023-10-01', checked: false },
    { id: 5, date: '2023-10-01', checked: false },
    { id: 1, date: '2023-10-01', checked: false },
    { id: 2, date: '2023-10-01', checked: false },
    { id: 3, date: '2023-10-01', checked: false },
  ]
  return (
    <div className='py-8 flex flex-col gap-5 items-center justify-center min-h-screen'>
      <div className='w-[90%] flex flex-col items-center gap-2'>
        <p className='text-sm'>Selos de (00) 00000 - 0000</p>
        <p className='text-xl font-bold text-primary-600'>00/10</p>
        <div className='flex flex-wrap gap-7 justify-center'>
          {tickets.map((ticket) => (
            <div key={ticket.id} className='fill-icon text-neutral-400'>
              {!ticket.checked && <Icon name='Ticket' size={80} />}
              {ticket.checked && (
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
