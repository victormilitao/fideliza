import { useAuthStore } from '@/store/useAuthStore'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

export const useLogout = () => {
  const { clearSession } = useAuthStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const logout = useCallback(() => {
    queryClient.clear()
    clearSession()
    navigate('/login')
  }, [])

  return { logout }
}
