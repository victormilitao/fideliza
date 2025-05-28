import api from '@/services/api'
import { Response } from '@/services/types/api.type'
import { Business } from '@/types/business.type'
import { Stamp } from '@/types/stamp.type'

const link = `${window.location.origin}/usuario/login`

export const sendAddStampMessage = async (
  stamp: Stamp
): Promise<Response<boolean>> => {
  try {
    if (!stamp) throw new Error('Stamp ID is required')
    console.dir(stamp)
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
  const personId = stamps[0]?.person_id || ''
  const { data } = await api.getPersonById(personId)
  if (!data?.phone || !business || !stamps || !business.campaign) return

  if (stamps?.length === 1) {
    sendFirstStampMessage(data?.phone, business)
    return
  }
  if (business.campaign?.stamps_required === stamps?.length) {
    sendBonusMessage(data?.phone, business)
    return
  }

  sendStampCountMessage(data?.phone, business, stamps)
}

const sendFirstStampMessage = (phone: string, business: Business) => {
  const message = `${business?.name}: Você ganhou seu primeiro selo! 🎉 Junte ${business.campaign?.stamps_required} selos e troque por um prêmio. Acompanhe seus selos e veja as regras em: ${link}`
  api.sendSms(phone, message)
}

const sendStampCountMessage = (
  phone: string,
  business: Business,
  stamps: Stamp[]
) => {
  const message = `${business.name}: Você ganhou mais 1 selo! 🎉 Seu progresso: ${stamps.length}/${business?.campaign?.stamps_required}. Junte ${business?.campaign?.stamps_required} selos e troque por um prêmio. Acompanhe seus selos e veja as regras em: ${link}`
  api.sendSms(phone, message)
}

const sendBonusMessage = (phone: string, business: Business) => {
  const code = business.campaign?.card?.prize_code
  const message = `${business.name}: Parabéns! 🎉 Você completou ${business?.campaign?.stamps_required} selos! 🏆 Informe o código ${code} no estabelecimento para resgatar o seu prêmio. Acompanhe seus selos e veja as regras em: ${link}`
  api.sendSms(phone, message)
}
