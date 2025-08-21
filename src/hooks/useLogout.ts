import { useAuthStore } from '@/store/useAuthStore'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

export const useLogout = () => {
  const { clearSession } = useAuthStore()
  const queryClient = useQueryClient()
  const logout = useCallback(() => {
    queryClient.clear()
    clearSession()
  }, [])

  return { logout }
}
