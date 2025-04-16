import api from '@/services/api'
import { useQuery } from '@tanstack/react-query'
import { useUserLoggedIn } from '../useUserLoggedIn'

export const useProfile = () => {
  const { user } = useUserLoggedIn()
  const {
    data: profile,
    error,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user?.id) throw Error('profile - user not logged in!')
      const { data, error } = await api.getProfile(user?.id)
      if (error) throw new Error(error.message)
      return data
    },
    staleTime: Infinity,
    enabled: !!user,
  })

  return {
    profile,
    error,
    isLoading,
    isError,
    refetch,
  }
}
