import { Response } from '@/services/types/api.type'
import supabase from '../config'
import { Card } from '@/types/card.type'

export const markCardAsCompleted = async (
  cardId: string
): Promise<Response<Card>> => {
  try {
    const { data: card, error: error } = await supabase
      .from('cards')
      .update({ completed_at: new Date(), prize_code: '5555' })
      .eq('id', cardId)
      .select()
      .maybeSingle()

    if (error) {
      console.error('markCardAsCompleted:', error)
      return { data: null, error }
    }

    if (!card) {
      return {
        data: null,
        error: new Error('Cartão não encontrado ao marcar como completo.'),
      }
    }

    return { data: card, error: null }
  } catch (err) {
    console.error('Signup - Unexpected error:', err)
    return { data: null, error: err as Error }
  }
}
