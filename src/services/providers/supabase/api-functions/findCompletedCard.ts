import { Response } from '@/services/types/api.type'
import supabase from '../config'
import { Card } from '@/types/card.type'

export const findCompletedCard = async (
  personId: string,
  campaignsIds: string[]
): Promise<Response<Card>> => {
  try {
    const { data: card, error } = await supabase
      .from('cards')
      .select('*')
      .eq('person_id', personId)
      .in('campaign_id', campaignsIds)
      .not('completed_at', 'is', null)
      .not('prize_code', 'is', null)
      .is('prized_at', null)
      .order('completed_at', { ascending: true })
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error('findCompletedCard - error:', error.message)
      return { data: null, error: error }
    }

    return { data: card, error: error }
  } catch (err) {
    console.error('findCompletedCard - Unexpected error:', err)
    return { data: null, error: err as Error }
  }
}
