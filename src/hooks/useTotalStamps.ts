import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'

export const useTotalStamps = (businessId?: string) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['total-stamps', businessId],
    queryFn: async () => {
      if (!businessId) return 0
      const { data, error } = await api.getTotalStampsByBusiness(businessId)
      if (error) throw error
      return data || 0
    },
    enabled: !!businessId,
  })

  return { totalStamps: data, isLoading, refetch }
}
