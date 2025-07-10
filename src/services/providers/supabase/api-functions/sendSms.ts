import { Response } from '@/services/types/api.type'
import supabase from '../config'

export const sendSms = async (
  phone: string,
  message: string
): Promise<Response<boolean>> => {
  try {
    phone = '+55' + phone
    console.dir(phone)
    console.dir(message)
    const { error } = await supabase.functions.invoke('send-whatsapp', {
      body: { phone, message },
    })

    if (error) return { data: null, error }

    return { data: true, error: null }
  } catch (err) {
    console.error('getCardsByPersonId - Unexpected error:', err)
    return { data: null, error: err as Error }
  }
}
