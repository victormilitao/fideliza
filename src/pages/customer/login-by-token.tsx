import { useAuth } from '@/hooks/customer/useAuth'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

export const LoginByToken = () => {
  const { token } = useParams()
  const { loginByToken } = useAuth()

  useEffect(() => {
    if (token) {
      loginByToken({ token })
    }
  }, [token, loginByToken])

  if (!token) return <div>Token inválido ou não fornecido.</div>

  return <div>Realizando login...</div>
}
