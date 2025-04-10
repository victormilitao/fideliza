import { useAuthStore } from '@/store/useAuthStore'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

export const useLogout = () => {
  const { clearSession } = useAuthStore()
  const navigate = useNavigate()
  const logout = useCallback(() => {
    clearSession()
    navigate('/login')
  }, [])

  return { logout }
}
