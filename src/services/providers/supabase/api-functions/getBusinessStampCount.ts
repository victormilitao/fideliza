import { Response } from '@/services/types/api.type'
import supabase from '../config'

export const getBusinessStampCount = async (
    campaignId: string
): Promise<Response<number>> => {
    try {
        const { count, error } = await supabase
            .from('stamps')
            .select('id, cards!inner(campaign_id)', { count: 'exact', head: true })
            .eq('cards.campaign_id', campaignId)

        if (error) {
            console.error('getBusinessStampCount - Error:', error)
            return { data: 0, error }
        }

        return { data: count ?? 0, error: null }
    } catch (err) {
        console.error('getBusinessStampCount - Unexpected error:', err)
        return { data: 0, error: err as Error }
    }
}
