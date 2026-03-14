import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export const PaymentReturn = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId: string | null = searchParams.get('session_id')

  useEffect(() => {
    if (sessionId) {
      router.replace(`/store/payment?session_id=${sessionId}`)
    } else {
      router.replace('/store/payment')
    }
  }, [sessionId, router])

  return null
}
