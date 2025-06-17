import { Response } from '@/services/types/api.type'
import supabase from '../config'
import { Business } from '@/types/business.type'
import { Stamp } from '@/types/stamp.type'

export const getStampStructure = async (
  stamp: Stamp
): Promise<Response<Business>> => {
  try {
    const { data, error } = await supabase
      .from('business')
      .select(
        `
        *,
        campaigns:campaigns!inner (
          *,
          cards:cards!inner (
            *,
            stamps:stamps(*)
          )
        )
      `
      )
      .eq('campaigns.cards.id', stamp.card_id)
      .limit(1)

    if (error) throw error

    const business = data?.[0] as Business
    handleResponse(business)

    return { data: business, error: null }
  } catch (err) {
    console.error('getStampStructure - Erro inesperado:', err)
    return { data: null, error: err as Error }
  }
}

const handleResponse = (business: Business): void => {
  if (business.campaigns?.length) {
    business.campaign = business.campaigns[0]
  }
  if (business.campaign?.cards?.length) {
    business.campaign.card = business.campaign.cards[0]
  }
}
