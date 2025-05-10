import { Response } from '@/services/types/api.type'
import supabase from '../config'

export const reward = async (
  cardId: string,
  code: string
): Promise<Response<boolean>> => {
  try {
    const { data, error } = await supabase
      .from('cards')
      .update({ prized_at: new Date() })
      .eq('id', cardId)
      .eq('prize_code', code)
      .select()
      .maybeSingle()

    if (error) {
      console.error('reward:', error)
      return { data: null, error: error }
    }

    return { data: !!data, error: null }
  } catch (err) {
    console.error('reward - Unexpected error:', err)
    return { data: null, error: err as Error }
  }
}
