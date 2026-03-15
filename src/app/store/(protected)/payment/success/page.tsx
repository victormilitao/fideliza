'use client'

import { Suspense } from 'react'
import { PaymentSuccess } from '@/views/business/payment-success'

export default function PaymentSuccessPage() {
  return (
    <Suspense>
      <PaymentSuccess />
    </Suspense>
  )
}
