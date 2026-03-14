import { Button } from '@/components/button/button'
import { useBusinessCardsByPerson } from '@/hooks/useBusinessCardsByPerson'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { applyMask } from '@/utils/mask-utils'
import { useLoggedPerson } from '@/hooks/customer/useLoggedPerson'
import { BusinessCard } from './business-card'
import { CampaignRules } from './campaign-rules'
import { Card } from '../../components/customer/card'
import { Header } from '@/views/header'

export const Tickets = () => {
  const { person } = useLoggedPerson()
  const { data: businesses } = useBusinessCardsByPerson(person?.id)

  if (!businesses?.length) {
    redirect('/user')
  }

  const business = businesses?.[0]
  const { stamps_required, cards } = business?.campaign || {}
  const maskedPhone = applyMask(person?.phone, 'phone')

  if (business && (!cards || cards.length === 0)) {
    redirect('/user')
  }

  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <div className='flex flex-1 flex-col gap-5 items-center justify-center py-8'>
        <div className='w-[90%] flex flex-col items-center gap-2'>
          <div className='min-w-3xs max-w-lg'>
          <p className='text-sm'>Meus selos</p>
          <p>{maskedPhone}</p>
        </div>
        <BusinessCard business={business || {}}>
          <CampaignRules campaign={business?.campaign || {}} />
        </BusinessCard>
        {cards?.map((card, index) => (
          <div key={card.id}>
            <Card
              card={card}
              index={cards.length > 1 ? index + 1 : undefined}
              stampsRequired={stamps_required || 0}
            />
            {index < cards.length - 1 && (
              <div className='relative w-full'>
                <hr className='absolute -left-full -right-full border-t text-neutral-400' />
              </div>
            )}
          </div>
        ))}
        </div>
      </div>
      <div className='mt-5 sm:mt-40'>
        <Link href={'/user'}>
          <Button variant='secondary' className='w-3xs'>
            Voltar
          </Button>
        </Link>
      </div>
    </div>
  )
}
