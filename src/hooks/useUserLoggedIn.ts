import api from '@/services/api'
import { useQuery } from '@tanstack/react-query'
import { useLogout } from './useLogout'

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
      if (error) {
        logout()
        throw new Error(error.message)
      }
      return data
    },
    staleTime: Infinity,
  })

  return {
    user,
    error,
    isLoading,
    isError,
    refetch,
  }
}
