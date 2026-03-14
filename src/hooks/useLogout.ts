import api from '@/services/api'
import { useAuthStore } from '@/store/useAuthStore'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import { useRouter } from 'next/navigation'

export const useLogout = (redirect: boolean = true) => {
  const { clearSession } = useAuthStore()
  const queryClient = useQueryClient()
  const router = useRouter()
  
  const logout = useCallback(async () => {
    try {
      queryClient.clear()
      clearSession()
      await api.logout()
      redirect && router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }, [queryClient, clearSession, redirect, router])

  return { logout }
}
