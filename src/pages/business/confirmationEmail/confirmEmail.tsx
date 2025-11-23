import { useEmailToken } from '@/hooks/business/useEmailToken'
import { useParams } from 'react-router-dom'
import { useEffect, useRef } from 'react'

export const ConfirmEmail = () => {
  const { token } = useParams()
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
