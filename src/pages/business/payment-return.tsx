import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

export const PaymentReturn = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')

  useEffect(() => {
    if (sessionId) {
      navigate(`/estabelecimento/payment?session_id=${sessionId}`, { replace: true })
    } else {
      navigate('/estabelecimento/payment', { replace: true })
    }
  }, [sessionId, navigate])

  return null
}

