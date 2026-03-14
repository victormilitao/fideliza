import { Business } from '@/types/business.type'
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'

type BusinessCardProps = {
  business: Business
  children?: ReactNode
}

export const BusinessCard = ({ business, children }: BusinessCardProps) => {
  const router = useRouter()
  const handleGoToTickets = () => {
    router.push('/user/tickets')
  }

  return (
    <div
      key={business?.id}
      onClick={() => handleGoToTickets()}
      className='min-w-3xs max-w-lg shadow-[0_0_12px_0_#0000001A] bg-white rounded-lg p-4 flex flex-col gap-2 cursor-pointer'
    >
      <p className='text-sm font-semibold'>{business.name}</p>
      <p className='text-sm text-neutral-600'>{business.address}</p>
      {children}
    </div>
  )
}
