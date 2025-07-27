import { Response } from '@/services/types/api.type'
import supabase from '../../config'
import api from '@/services/api'
import { ApiFunctions } from '@/services/types/api-functions.type'
import { generateUuid } from '@/utils/uuid'

export type ConfirmEmailResponse = {
  tokenValid: boolean
  userId: string | null
}

export const confirmEmail: ApiFunctions['confirmEmail'] = async (
  token: string
): Promise<Response<ConfirmEmailResponse | null>> => {
  try {
    if (!token) throw new Error('Token is required')

    const { data: tokenData, error: errorToken } = await supabase
      .from('email_confirmation_tokens')
      .select('user_id, confirmed_at, expires_at')
      .eq('token', token)
      .maybeSingle()

    if (errorToken || !tokenData) throw new Error('Invalid token')

    if (tokenData.confirmed_at) {
      return {
        data: { tokenValid: true, userId: tokenData.user_id },
        error: null,
      }
    }

    const now = new Date()
    // const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000)
    const expiresAt = new Date(tokenData.expires_at)
    if (expiresAt < now) {
      return {
        data: { tokenValid: false, userId: tokenData.user_id },
        error: null,
      }
    }
    const { data, error } = await supabase
      .from('email_confirmation_tokens')
      .update({ confirmed_at: now })
      .eq('token', token)
      .select('user_id')
      .maybeSingle()

    if (error) throw new Error('Failed to confirm email')

    const { data: verifyProfile, error: verifyProfileError } =
      await api.verifyProfile(data?.user_id)

    if (verifyProfileError || !verifyProfile) {
      throw new Error('Failed to verify profile after email confirmation')
    }

    return { data: { tokenValid: true, userId: data?.user_id }, error: null }
  } catch (err) {
    console.error('confirmEmail - Unexpected error:', err)
    return { data: null, error: err as Error }
  }
}
