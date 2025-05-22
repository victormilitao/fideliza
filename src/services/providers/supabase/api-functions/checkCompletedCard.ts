import { Response } from '@/services/types/api.type'
import api from '@/services/api'
import { Stamp } from '@/types/stamp.type'

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
    if (campaignError) {
      console.error('checkCompletedCard:', campaignError)
      return { data: null, error: campaignError }
    }

    const cardCompleted = campaign?.stamps_required === stamps?.length

    cardCompleted && await api.markCardAsCompleted(cardId)

    sendMessage(stamps, cardCompleted)

    return { data: cardCompleted, error: null }
  } catch (err) {
    console.error('Signup - Unexpected error:', err)
    return { data: null, error: err as Error }
  }
}

const sendMessage = async (stamps: Stamp[], cardCompleted: boolean) => {
  const personId = stamps[0]?.person_id || ''
  const { data } = await api.getPersonById(personId)
  if (!data?.phone) return
  let functionToCall

  if (stamps?.length === 1) {
    functionToCall ||= sendFirstStampMessage
    // return
  }
  functionToCall ||= cardCompleted ? sendBonusMessage : sendStampCountMessage
  functionToCall(data.phone)
}

const sendFirstStampMessage = (phone: string) => {
  api.sendSms(phone, 'sendFirstStampMessage')
}

const sendStampCountMessage = (phone: string) => {
  api.sendSms(phone, 'sendStampCountMessage')
}

const sendBonusMessage = (phone: string) => {
  api.sendSms(phone, 'sendBonusMessage')
}
