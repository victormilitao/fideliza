import { Business } from '@/types/business.type'
import { BusinessStamp } from './business-stamp'

export const BusinessStamps = ({ business }: { business: Business }) => {
  return (
    <div className='flex items-center gap-5'>
      {business
        ? business.campaign?.cards?.map((card) => (
            <div key={card.id}>
              <BusinessStamp
                card={card}
                stamps_required={business?.campaigns?.[0].stamps_required || 0}
              />
            </div>
          ))
        : 'Sem dados.'}
    </div>
  )
}
