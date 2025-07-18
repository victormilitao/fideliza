import api from '@/services/api'
import { Response } from '@/services/types/api.type'
import { Business } from '@/types/business.type'
import { Stamp } from '@/types/stamp.type'
import {
  CountStamps,
  CountStampsSid,
  FirstStamp,
  FirstStampSid,
  StampsCompleted,
  StampsCompletedSid,
} from '@/types/whatsapp-templates'

export const sendAddStampMessage = async (
  stamp: Stamp
): Promise<Response<boolean>> => {
  try {
    if (!stamp) throw new Error('Stamp ID is required')

    const { data: business } = await api.getStampStructure(stamp)
    if (!business) throw new Error('Business not found for the stamp')
    sendMessage(business)

    return { data: true, error: null }
  } catch (err) {
    console.error('sendMessage - Unexpected error:', err)
    return { data: null, error: err as Error }
  }
}

const sendMessage = async (business: Business) => {
  const stamps = business?.campaign?.card?.stamps || []
  const personId = business?.campaign?.card?.person_id || ''
  const { data } = await api.getPersonById(personId)
  const { data: token } = await api.generateLoginToken(personId)
  const link = token || ''
  if (!data?.phone || !business || !stamps || !business.campaign) return

  if (stamps?.length === 1) {
    sendFirstStampMessage(data?.phone, business, link)
    return
  }
  if (business.campaign?.stamps_required === stamps?.length) {
    sendBonusMessage(data?.phone, business, link)
    return
  }

  sendStampCountMessage(data?.phone, business, stamps, link)
}

const sendFirstStampMessage = (
  phone: string,
  business: Business,
  link: string
) => {
  const businessName = business?.name || ''
  const stampsRequired = String(business?.campaign?.stamps_required || 0)
  const message = `${businessName}: Você ganhou seu primeiro selo! 🎉 Junte ${stampsRequired} selos e troque por um prêmio. Acompanhe seus selos e veja as regras em: ${link}`
  api.sendWhatsapp(phone, FirstStampSid, {
    businessName,
    stampsRequired,
    link,
    message,
  } as FirstStamp)
}

const sendStampCountMessage = (
  phone: string,
  business: Business,
  stamps: Stamp[],
  link: string
) => {
  const businessName = business?.name || ''
  const stampsRequired = String(business?.campaign?.stamps_required || 0)
  const stampsCount = String(stamps.length)
  const message = `${businessName}: Você ganhou mais 1 selo! 🎉 Seu progresso: ${stampsCount}/${stampsRequired}. Junte ${stampsRequired} selos e troque por um prêmio. Acompanhe seus selos e veja as regras em: ${link}`
  api.sendWhatsapp(phone, CountStampsSid, {
    businessName,
    stampsRequired,
    stampsCount,
    link,
    message,
  } as CountStamps)
}

const sendBonusMessage = (phone: string, business: Business, link: string) => {
  const code = business.campaign?.card?.prize_code
  const businessName = business?.name || ''
  const stampsRequired = String(business?.campaign?.stamps_required || 0)
  const message = `${businessName}: Parabéns! 🎉 Você completou ${stampsRequired} selos! 🏆 Informe o código ${code} no estabelecimento para resgatar o seu prêmio. Acompanhe seus selos e veja as regras em: ${link}`
  api.sendWhatsapp(phone, StampsCompletedSid, {
    businessName,
    stampsRequired,
    link,
    code,
    message,
  } as StampsCompleted)
}
