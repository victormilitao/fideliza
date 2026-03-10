import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'
import { useMyBusiness } from './useMyBusiness'
import { useMyActiveCampaigns } from './useMyActiveCampaigns'

export const TRIAL_STAMP_LIMIT = 50

export const useTrialStamps = () => {
    const { business } = useMyBusiness()
    const { campaigns } = useMyActiveCampaigns(business?.id || '')
    const campaignId = campaigns?.[0]?.id || ''

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['trial-stamps', campaignId],
        queryFn: async () => {
            if (!campaignId) return 0
            const { data: count } = await api.getBusinessStampCount(campaignId)
            return count ?? 0
        },
        enabled: !!campaignId,
        staleTime: 30 * 1000, // 30 segundos
    })

    const stampsSent = data ?? 0
    const stampsRemaining = Math.max(TRIAL_STAMP_LIMIT - stampsSent, 0)

    return {
        stampsSent,
        stampsRemaining,
        totalTrialStamps: TRIAL_STAMP_LIMIT,
        isLoading,
        refetch,
    }
}
