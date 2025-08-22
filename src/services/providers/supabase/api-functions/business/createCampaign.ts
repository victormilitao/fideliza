import { Response } from '@/services/types/api.type'
import supabase from '../../config'
import { Campaign } from '@/types/campaign.type'

export const createCampaign = async (
  campaign: Omit<Campaign, 'id' | 'created_at' | 'business' | 'cards' | 'card'>
): Promise<Response<Campaign>> => {
  try {
    const { data: newCampaign, error } = await supabase
      .from('campaigns')
      .insert([campaign])
      .select()
      .maybeSingle()

    if (error || !newCampaign) {
      console.error('createCampaign:', error)
      return { data: null, error }
    }

    return { data: newCampaign, error: null }
  } catch (err) {
    console.error('createCampaign - Unexpected error:', err)
    return { data: null, error: err as Error }
  }
}
