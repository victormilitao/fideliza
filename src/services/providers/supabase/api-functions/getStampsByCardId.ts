import { Response } from '@/services/types/api.type'
import supabase from '../config'
import { Stamp } from '@/types/stamp.type'

export const getStampsByCardId = async (
  cardId: string
): Promise<Response<Stamp[]>> => {
  try {
    const { data: stamps, error: error } = await supabase
      .from('stamps')
      .select()
      .eq('card_id', cardId)

    if (error) {
      console.error('getStampsByCardId:', error)
      return { data: null, error }
    }

    if (!stamps) return { data: [], error: null }

    return { data: stamps, error: null }
  } catch (err) {
    console.error('Signup - Unexpected error:', err)
    return { data: null, error: err as Error }
  }
}
