import { Business } from '@/types/business.type'
import { useNavigate } from 'react-router-dom'
import { BusinessStamps } from './business-stamps'

type BusinessCardsProps = {
  businesses: Business[] | null | undefined
}

export const BusinessCards = ({ businesses }: BusinessCardsProps) => {
  const navigate = useNavigate()
  const handleGoToTickets = (businessId: string | undefined) => {
    navigate('/usuario/tickets', {
      state: { params: { businessId  } },
    })
  }

  return (
    <div className='min-w-3xs max-w-lg'>
      {businesses && businesses.length > 0 && (
        <div className='flex flex-col gap-5'>
          {businesses.map((business) => (
            <div
              key={business?.id}
              onClick={() => handleGoToTickets(business.id)}
              className='shadow-[0_0_12px_0_#0000001A] bg-white rounded-lg p-4 flex flex-col gap-2'
            >
              <p className='text-sm font-semibold'>{business.name}</p>
              <p className='text-sm text-neutral-600'>{business.address}</p>
              <div className='flex items-center gap-5'>
                {business
                  ? business.campaign?.cards?.map((card) => (
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
