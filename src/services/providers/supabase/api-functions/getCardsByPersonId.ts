import { Response } from '@/services/types/api.type'
import { Card } from '@/types/card.type'
import supabase from '../config'

export const getCardsByPersonId = async (
  personId: string
): Promise<Response<Card[]>> => {
  try {
    const { data, error } = await supabase
      .from('cards')
      .select(`*, stamp(*)`)
      .eq('person_id', personId)
      .order('created_at', { ascending: true })
    return { data, error }
  } catch (err) {
    console.error('getCardsByPersonId - Unexpected error:', err)
    return { data: null, error: err as Error }
  }
}
