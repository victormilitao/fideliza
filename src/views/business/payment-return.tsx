import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export const PaymentReturn = () => {
  const searchParams = useSearchParams()
  const sessionId: string | null = searchParams.get('session_id')

  useEffect(() => {
    if (sessionId) {
      window.location.replace(`/store/payment/success?session_id=${sessionId}`)
    } else {
      window.location.replace('/store/payment')
    }
  }, [sessionId])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
    </div>
  )
}
