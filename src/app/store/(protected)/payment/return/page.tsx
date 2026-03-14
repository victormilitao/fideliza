'use client'

import { Suspense } from 'react'
import { PaymentReturn } from '@/views/business/payment-return'

export default function PaymentReturnPage() {
  return (
    <Suspense>
      <PaymentReturn />
    </Suspense>
  )
}
