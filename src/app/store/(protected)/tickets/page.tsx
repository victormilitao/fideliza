'use client'

import { Suspense } from 'react'
import { Tickets } from '@/views/business/tickets/tickets'

export default function TicketsPage() {
  return (
    <Suspense>
      <Tickets />
    </Suspense>
  )
}
