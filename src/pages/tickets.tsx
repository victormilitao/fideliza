import { Button } from '@/components/button/button'
import Icon from '@/components/icon'
import { useStampsByUserId } from '@/hooks/useStampsByUserId'
import { Link, useLocation } from 'react-router-dom'

export const Tickets = () => {
  const location = useLocation()
  const userId = (location.state.params) || {}
  console.dir(userId)
  const { data: stamps } = useStampsByUserId(userId)

  return (
    <div className='py-8 flex flex-col gap-5 items-center justify-center min-h-screen'>
      <div className='w-[90%] flex flex-col items-center gap-2'>
        <p className='text-sm'>Selos de (00) 00000 - 0000</p>
        <p className='text-xl font-bold text-primary-600'>
          {stamps?.length}/10
        </p>
        <div className='flex flex-wrap gap-7 justify-center'>
          {[...Array(10)].map((_, index) => (
            <div key={index} className='fill-icon text-neutral-400'>
              {!stamps?.[index] && (
                <Icon name='Ticket' size={80} strokeWidth={0.7} />
              )}
              {stamps?.[index] && (
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
