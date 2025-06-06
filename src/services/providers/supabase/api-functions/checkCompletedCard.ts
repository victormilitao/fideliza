import { Response } from '@/services/types/api.type'
import api from '@/services/api'

export const checkCompletedCard = async (
  cardId: string,
  campaignId: string
): Promise<Response<boolean>> => {
  try {
    const { data: stamps, error: stampsError } = await api.getStampsByCardId(
      cardId
    )
    if (stampsError) {
      console.error('checkCompletedCard:', stampsError)
      return { data: null, error: stampsError }
    }

    if (!stamps || stamps?.length <= 0) return { data: false, error: null }

    const { data: campaign, error: campaignError } = await api.getCampaignById(
      campaignId
    )
    if (campaignError || !campaign) {
      console.error('checkCompletedCard:', campaignError)
      return { data: null, error: campaignError }
    }

    const cardCompleted = campaign?.stamps_required === stamps?.length

    cardCompleted && await api.markCardAsCompleted(cardId)

    return { data: cardCompleted, error: null }
  } catch (err) {
    console.error('Signup - Unexpected error:', err)
    return { data: null, error: err as Error }
  }
}
