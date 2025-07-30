import { Business } from '@/types/business.type'
import { useNavigate } from 'react-router-dom'
import { ReactNode } from 'react'

type BusinessCardProps = {
  business: Business
  children?: ReactNode
}

export const BusinessCard = ({ business, children }: BusinessCardProps) => {
  const navigate = useNavigate()
  const handleGoToTickets = () => {
    navigate('/usuario/tickets', {
      state: { params: { businessId: business.id } },
    })
  }

  return (
    <div
      key={business?.id}
      onClick={() => handleGoToTickets()}
      className='min-w-3xs max-w-lg shadow-[0_0_12px_0_#0000001A] bg-white rounded-lg p-4 flex flex-col gap-2 cursor-pointer'
    >
      <p className='text-sm font-semibold'>{business.name}</p>
      <p className='text-sm text-neutral-600'>{business.street}</p>
      {children}
    </div>
  )
}
