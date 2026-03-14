import { useAuth } from '@/hooks/customer/useAuth'
import { useEffect } from 'react'
import { useParams } from 'next/navigation'

export const LoginByToken = () => {
  const params = useParams()
  const token: string = typeof params.token === 'string' ? params.token : ''
  const { loginByToken } = useAuth()

  useEffect(() => {
    if (token) {
      loginByToken({ token })
    }
  }, [token, loginByToken])

  if (!token) return <div>Token inválido ou não fornecido.</div>

  return <div>Realizando login...</div>
}
