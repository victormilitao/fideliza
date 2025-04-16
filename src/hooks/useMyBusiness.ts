import api from '@/services/api'
import { useQuery } from '@tanstack/react-query'
import { useUserLoggedIn } from './useUserLoggedIn'

export const useMyBusiness = () => {
  const { user } = useUserLoggedIn()

  const { data: business, error, isLoading, isError, refetch } = useQuery({
    queryKey: ['my-business', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not logged in')
      const { data, error } = await api.getMyBusiness(user)
      if (error) throw new Error(error.message)
      return data
    },
    enabled: !!user,
    staleTime: Infinity,
  })

  return {
    business,
    error,
    isLoading,
    isError,
    refetch,
  }
}
