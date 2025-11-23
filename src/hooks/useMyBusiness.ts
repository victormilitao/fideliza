import api from '@/services/api'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/useAuthStore'
import { BUSINESS_OWNER } from '@/types/profile'

export const useMyBusiness = () => {
  const { session } = useAuthStore()
  const { profile } = useAuthStore()

  const isEnabled = !!session && profile?.role === BUSINESS_OWNER

  const {
    data: business,
    error,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['my-business', session?.user.id],
    queryFn: async () => {
      if (!session?.user.id) throw new Error('User not logged in')
      const { data, error } = await api.getMyBusiness({ id: session?.user.id })
      if (error) throw new Error(error.message)
      return data
    },
    enabled: isEnabled,
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
