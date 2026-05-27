'use client'

import { Suspense } from 'react'
import { CreateCampaign } from '@/views/business/create/createCampaign'

export default function CreateCampaignPage() {
  return (
    <Suspense>
      <CreateCampaign />
    </Suspense>
  )
}
