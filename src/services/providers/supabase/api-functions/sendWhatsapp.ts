import { Response } from '@/services/types/api.type'
import supabase from '../config'
import { WhastappTemplates } from '@/types/whatsapp-templates'
import { toSnakeCase } from '@/utils/toSnakeCase'

export const sendWhatsapp = async (
  phone: string,
  contentSid: string,
  params: WhastappTemplates
): Promise<Response<boolean>> => {
  try {
    phone = '55' + phone
    const snakeParams = toSnakeCase(params)
    console.dir(params.message)
    const { error } = await supabase.functions.invoke('send-whatsapp', {
      body: { phone, contentSid, params: snakeParams },
    })

    if (error) return { data: null, error }

    return { data: true, error: null }
  } catch (err) {
    console.error('getCardsByPersonId - Unexpected error:', err)
    return { data: null, error: err as Error }
  }
}
