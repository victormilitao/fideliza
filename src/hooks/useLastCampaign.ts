import api from '@/services/api'
import { useQuery } from '@tanstack/react-query'
import { Campaign } from '@/types/campaign.type'

/**
 * Hook que busca a última campanha criada para um business.
 * Utilizado para pré-preencher o formulário de campanha na reativação do plano.
 */
export const useLastCampaign = (businessId: string | undefined) => {
  const {
    data: lastCampaign,
    error,
    isLoading,
    isError,
  } = useQuery<Campaign | null>({
    queryKey: ['last-campaign', businessId],
    queryFn: async () => {
      if (!businessId) return null
      const { data, error } = await api.getMyActiveCampaigns(businessId)
      if (error) throw error
      if (!data || data.length === 0) return null

      // Ordena por created_at DESC e retorna a mais recente
      const sorted = [...data].sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0
        return dateB - dateA
      })

      return sorted[0]
    },
    enabled: !!businessId,
    staleTime: 60 * 60 * 1000, // 1 hora
  })

  return {
    lastCampaign,
    error,
    isLoading,
    isError,
  }
}
