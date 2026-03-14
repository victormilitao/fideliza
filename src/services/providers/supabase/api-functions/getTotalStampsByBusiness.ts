import supabase from '../config'
import { Response } from '@/services/types/api.type'

export const getTotalStampsByBusiness = async (
  businessId: string
): Promise<Response<number>> => {
  try {
    // We need to count stamps through campaigns -> cards -> stamps
    // A simpler way: query campaigns by business_id, then get all their cards, then get stamps
    
    // First, get all campaigns for this business
    const { data: campaigns, error: campaignError } = await supabase
      .from('campaigns')
      .select('id')
      .eq('business_id', businessId)

    if (campaignError || !campaigns) {
      console.error('getTotalStampsByBusiness - campaignError: ', campaignError)
      return { data: null, error: campaignError }
    }

    if (campaigns.length === 0) {
      return { data: 0, error: null }
    }

    const campaignIds = campaigns.map((c) => c.id)

    // Now count all stamps associated with cards from these campaigns
    // We can join cards and filter by campaign_id
    const { count, error: stampError } = await supabase
      .from('stamps')
      .select('cards!inner(campaign_id)', { count: 'exact', head: true })
      .in('cards.campaign_id', campaignIds)

    if (stampError) {
      console.error('getTotalStampsByBusiness - stampError: ', stampError)
      return { data: null, error: stampError }
    }

    return { data: count || 0, error: null }
  } catch (err) {
    console.error('Unexpected error:', err)
    return { data: null, error: err as Error }
  }
}
