import { Response } from '@/services/types/api.type'
// import supabase from '../config'

export const sendSms = async (
  phone: string,
  message: string
): Promise<Response<boolean>> => {
  try {
    const phoneCountry = '+55' + phone
    console.dir(phoneCountry)
    console.dir(message)
    // const { error } = await supabase.functions.invoke('send-sms', {
    //   body: { phoneCountry, message },
    // })

    // if (error) return { data: null, error }

    return { data: true, error: null }
  } catch (err) {
    console.error('getCardsByPersonId - Unexpected error:', err)
    return { data: null, error: err as Error }
  }
}
