import { Response } from '@/services/types/api.type'
import supabase from '../config'
import api from '@/services/api'
import { Card } from '@/types/card.type'

export const checkCompletedCard = async (
  cardId: string,
  campaignId: string
): Promise<Response<boolean>> => {
  try {
    //buscar stamps do cartão
    const { data: stamps, error: stampsError } = await api.getStampsByCardId(cardId)
    if (stampsError) {
      console.error('checkCompletedCard:', stampsError)
      return { data: null, error: stampsError }
    }

    return { data: newCard, error: null }
  } catch (err) {
    console.error('Signup - Unexpected error:', err)
    return { data: null, error: err as Error }
  }
}
