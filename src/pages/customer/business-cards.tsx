import { Business } from '@/types/business.type'
import { BusinessCard } from './business-card'
import { BusinessStamps } from './business-stamps'

type BusinessCardsProps = {
  businesses: Business[] | null | undefined
}

export const BusinessCards = ({ businesses }: BusinessCardsProps) => {
  return (
    <div className='min-w-3xs max-w-lg'>
      {businesses && businesses.length > 0 && (
        <div className='flex flex-col gap-5'>
          {businesses.map((business) => (
            <BusinessCard key={business.id} business={business}>
              <BusinessStamps business={business} />

            </BusinessCard>
          ))}
        </div>
      )}
    </div>
  )
}
