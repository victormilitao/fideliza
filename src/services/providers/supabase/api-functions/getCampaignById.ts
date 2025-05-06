import { Response } from '@/services/types/api.type'
import supabase from '../config'
import { Campaign } from '@/types/campaign.type'

export const getCampaignById = async (
  campaignId: string
): Promise<Response<Campaign>> => {
  try {
    const { data: campaign, error: error } = await supabase
      .from('campaigns')
      .select()
      .eq('id', campaignId)
      .maybeSingle()

    if (error) {
      console.error('getCampaignById:', error)
      return { data: null, error }
    }

    return { data: campaign, error: null }
  } catch (err) {
    console.error('Signup - Unexpected error:', err)
    return { data: null, error: err as Error }
  }
}
