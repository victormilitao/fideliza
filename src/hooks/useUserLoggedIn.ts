import api from '@/services/api'
import { useQuery } from '@tanstack/react-query'

export const useUserLoggedIn = () => {
  const { data: user, error, isLoading, isError, refetch } = useQuery({
    queryKey: ['user-logged'],
    queryFn: async () => {
      const { data, error } = await api.getUserLoggedIn()
      if (error) throw new Error(error.message)
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
