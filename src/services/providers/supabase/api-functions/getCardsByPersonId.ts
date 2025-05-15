import { Response } from '@/services/types/api.type'
import supabase from '../config'
import { Business } from '@/types/business.type'

export const getBusinessCardsByPersonId = async (
  personId: string
): Promise<Response<Business[]>> => {
  try {
    const { data, error } = await supabase
      .from('business')
      .select(
        `
        *,
        campaigns (
          *,
          cards (
            *,
            stamp(*)
          )
        )
      `
      )
      .eq('campaigns.cards.person_id', personId)
      .order('created_at', { ascending: true, foreignTable: 'campaigns' })

    return { data, error }
  } catch (err) {
    console.error('getCardsByPersonId - Unexpected error:', err)
    return { data: null, error: err as Error }
  }
}
