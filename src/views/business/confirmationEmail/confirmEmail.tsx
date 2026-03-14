import { useEmailToken } from '@/hooks/business/useEmailToken'
import { useParams } from 'next/navigation'
import { useEffect, useRef } from 'react'

export const ConfirmEmail = () => {
  const params = useParams()
  const token: string = typeof params.token === 'string' ? params.token : ''
  const { verifyToken } = useEmailToken()
  const calledRef = useRef(false)

  useEffect(() => {
    if (token && !calledRef.current) {
      verifyToken({ token })
      calledRef.current = true
    }
  }, [token, verifyToken])

  return 'Verificando Token...'
}
