import api from '@/services/api'
import { useQuery } from '@tanstack/react-query'
import { BusinessSubscription } from '@/types/businessSubscription.type'

export const useBusinessSubscription = (businessId: string | undefined) => {
  const {
    data: subscription,
    error,
    isLoading,
    isError,
    refetch,
  } = useQuery<BusinessSubscription | null>({
    queryKey: ['business-subscription', businessId],
    queryFn: async () => {
      if (!businessId) return null
      const { data, error } = await api.getBusinessSubscriptionByBusinessId(businessId)
      if (error) throw error
      return data
    },
    enabled: !!businessId,
    staleTime: 24 * 60 * 60 * 1000, // 1 dia em milissegundos
    gcTime: 24 * 60 * 60 * 1000, // 1 dia em milissegundos (anteriormente cacheTime)
  })

  return {
    subscription,
    error,
    isLoading,
    isError,
    refetch,
  }
}

