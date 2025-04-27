import api from '@/services/api'
import { useQuery } from '@tanstack/react-query'

export const useMyActiveCampaigns = (businessId: string) => {
  const { data: campaigns, error, isLoading, isError, refetch } = useQuery({
    queryKey: ['my-campaigns', businessId],
    queryFn: async () => {
      if (!businessId) throw new Error('Business id not provided!')
      const { data, error } = await api.getMyActiveCampaigns(businessId)
      if (error) throw new Error(error.message)
      return data
    },
    enabled: !!businessId,
    staleTime: 60 * 60,
  })

  return {
    campaigns,
    error,
    isLoading,
    isError,
    refetch,
  }
}
