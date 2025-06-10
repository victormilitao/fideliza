import { Response } from '@/services/types/api.type'
import supabase from '../config'
import { Stamp } from '@/types/stamp.type'

export const getStampsByUserId = async (
  userId: string,
  // campaignId: string
): Promise<Response<Stamp[]>> => {
  try {
    
    const { data: stamps, error } = await supabase
      .from('stamps')
      .select('*')
      .eq('person_id', userId)
      // .eq('card_id', campaignId)

    return {
      data: stamps || null,
      error: error || null,
    }
  } catch (err) {
    console.error('Unexpected error:', err)
    return { data: null, error: null }
  }
}
