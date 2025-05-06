import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'
import { useMyBusiness } from './useMyBusiness'
import { useMyActiveCampaigns } from './useMyActiveCampaigns'

export const useStampsByUserId = (userId?: string) => {
  const { business } = useMyBusiness()
  const { campaigns } = useMyActiveCampaigns(business?.id || '')
  return useQuery({
    queryKey: ['stamps-by-user-id', userId],
    queryFn: async () => {
      if (!userId) throw new Error('UserId inválido')
      if (!business?.id) throw new Error('BusinessId inválido')
      if (!campaigns?.length || campaigns.length === 0) {
        throw new Error('campaign id inválido')
      }
      const { data } = await api.getStampsByUserId(
        userId,
        campaigns[0].id || ''
      )
      return data
    },
  enabled: !!userId && !!business?.id && !!campaigns?.length,
  })
}
