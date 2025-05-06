import { Response } from '@/services/types/api.type'
import supabase from '../config'
import { Campaign } from '@/types/campaign.type'

export const getMyActiveCampaigns = async (
  businessId: string
): Promise<Response<Campaign[]>> => {
  try {
    const { data: campaigns, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('business_id', businessId)

    return {
      data: campaigns || null,
      error: error || null,
    }
  } catch (err) {
    console.error('Unexpected error:', err)
    return { data: null, error: null }
  }
}
