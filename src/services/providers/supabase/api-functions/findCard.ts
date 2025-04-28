import { Response } from '@/services/types/api.type'
import supabase from '../config'
import { Card } from '@/types/card.type'

export const findCurrentCard = async (
  personId: string,
  campaignId: string
): Promise<Response<Card>> => {
  try {
    const { data: card, error } = await supabase
      .from('cards')
      .select('*')
      .eq('person_id', personId)
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error('findCurrentCard - error:', error.message)
      return { data: null, error: error }
    }

    return { data: card, error: error }
  } catch (err) {
    console.error('findCurrentCard - Unexpected error:', err)
    return { data: null, error: err as Error }
  }
}
