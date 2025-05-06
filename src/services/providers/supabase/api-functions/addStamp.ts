import api from '@/services/api'
import supabase from '../config'
import { Stamp } from '@/types/stamp.type'
import { Response } from '@/services/types/api.type'

export const addStamp = async (
  personId: string,
  campaignId: string
): Promise<Response<Stamp>> => {
  try {
    const { data: card, error: cardError } = await api.findOrCreateCard(
      personId,
      campaignId
    )

    if (cardError || !card?.id) {
      console.error('addStamp: ', cardError)
      return { data: null, error: cardError }
    }

    const { data: stamp, error } = await supabase
      .from('stamp')
      .insert([{ card_id: card?.id, person_id: personId }])
      .select()
      .maybeSingle()

    if (!stamp) {
      console.error('addStamp - error:', error)
      return { data: null, error }
    }

    await api.checkCompletedCard(card?.id, campaignId)

    return { data: stamp, error: error }
  } catch (err) {
    console.error('Unexpected error:', err)
    return { data: null, error: err as Error }
  }
}
