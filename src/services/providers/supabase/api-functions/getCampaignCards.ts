import { Response } from '@/services/types/api.type'
import supabase from '../config'
import { Card } from '@/types/card.type'

export const getCampaignCards = async (
  campaignId: string
): Promise<Response<Card[]>> => {
  try {
    const { data, error } = await supabase
      .from('cards')
      .select(`
        id,
        person_id,
        created_at,
        completed_at,
        prize_code,
        prized_at,
        stamps (
          id,
          created_at,
          person_id
        )
      `)
      .eq('campaign_id', campaignId)
      .is('prized_at', null) // Apenas cards não premiados

    if (error) {
      throw new Error(`getCampaignCards - Error fetching data: ${error}`)
    }

    return { data: data || [], error: null }
  } catch (err) {
    console.error('getCampaignCards - Unexpected error:', err)
    return { data: [], error: err as Error }
  }
}
