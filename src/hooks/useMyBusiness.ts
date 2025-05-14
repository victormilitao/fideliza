import api from '@/services/api'
import { useQuery } from '@tanstack/react-query'
import { useUserLoggedIn } from './useUserLoggedIn'
import { useAuthStore } from '@/store/useAuthStore'
import { BUSINESS_OWNER } from '@/types/profile'

export const useMyBusiness = () => {
  const { user } = useUserLoggedIn()
  const { profile } = useAuthStore()

  const {
    data: business,
    error,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['my-business', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not logged in')
      const { data, error } = await api.getMyBusiness(user)
      if (error) throw new Error(error.message)
      return data
    },
    enabled: !!user && profile?.role == BUSINESS_OWNER,
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
