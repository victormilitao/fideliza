import { Response } from '@/services/types/api.type'
import supabase from '../config'
import { Stamp } from '@/types/stamp.type'

export const getStampsByUserId = async (
  userId: string,
  businessId: string
): Promise<Response<Stamp[]>> => {
  try {
    const { data: stamps, error } = await supabase
      .from('stamp')
      .select('*')
      .eq('user_id', userId)
      .eq('business_id', businessId)

    return {
      data: stamps || null,
      error: error || null,
    }
  } catch (err) {
    console.error('Unexpected error:', err)
    return { data: null, error: null }
  }
}
