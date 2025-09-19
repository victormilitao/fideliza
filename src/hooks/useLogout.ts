import api from '@/services/api'
import { useAuthStore } from '@/store/useAuthStore'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

export const useLogout = (redirect: boolean = true) => {
  const { clearSession } = useAuthStore()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  
  const logout = useCallback(async () => {
    try {
      queryClient.clear()
      clearSession()
      await api.logout()
      redirect && navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }, [])

  return { logout }
}
