import { ApiFunctions } from '@/services/types/api-functions.type'
import supabase from '../config'

export const sendEmail: ApiFunctions['sendEmail'] = async (to: string, html: string) => {
  try {
    const { error } = await supabase.functions.invoke('send-email', {
      body: { to: 'victormilitao@gmail.com', html },
    })

    if (error) {
      console.error('Failed to send email:', error)
      return { data: null, error }
    }

    return { data: true, error: null }
  } catch (error) {
    console.error('Error sending email:', error)
    return { data: null, error }
  }
}
