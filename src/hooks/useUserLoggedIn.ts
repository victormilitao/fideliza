import api from '@/services/api'
import { useQuery } from '@tanstack/react-query'
import { useLogout } from './useLogout'
import { useEffect } from 'react'

export const useUserLoggedIn = () => {
  const { logout } = useLogout()

  const {
    data: user,
    error,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['user-logged'],
    queryFn: async () => {
      const { data, error } = await api.getUserLoggedIn()
      if (error || !data) throw new Error(error?.message)
      return data
    },
    retry: false,
    staleTime: 60 * 60 * 1000,
  })

  useEffect(() => {
    if (!isLoading && (isError || !user)) logout()
  }, [isLoading, isError, user])

  return {
    user,
    error,
    isLoading,
    isError,
    refetch,
  }
}
