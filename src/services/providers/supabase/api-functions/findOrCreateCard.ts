import { Response } from '@/services/types/api.type'
import supabase from '../config'
import api from '@/services/api'
import { Card } from '@/types/card.type'

export const findOrCreateCard = async (
  personId: string,
  campaignId: string
): Promise<Response<Card>> => {
  try {
    const { data: card } = await api.findCurrentCard(personId, campaignId)

    if (card) return { data: card, error: null }

    const { data: newCard, error: error } = await supabase
      .from('cards')
      .insert([{ person_id: personId, campaign_id: campaignId }])
      .select()
      .maybeSingle()

    if (error || !newCard) {
      console.error('findOrCreateCard:', error)
      return { data: null, error }
    }

    return { data: newCard, error: null }
  } catch (err) {
    console.error('Signup - Unexpected error:', err)
    return { data: null, error: err as Error }
  }
}
