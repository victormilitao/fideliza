import { Response } from '@/services/types/api.type'
import supabase from '../../config'
import { ApiFunctions } from '@/services/types/api-functions.type'

export type ConfirmEmailResponse = {
  tokenValid: boolean
  userId: string | null
}

export const confirmEmail: ApiFunctions['confirmEmail'] = async (
  token: string
): Promise<Response<ConfirmEmailResponse | null>> => {
  try {
    if (!token) throw new Error('Token is required')

    const { data, error } = await supabase.rpc(
      'confirm_email_verify_profile',
      { p_token: token }
    )

    if (error) throw new Error('Failed to confirm email')

    const result = data as {
      token_valid: boolean
      user_id: string | null
      error?: string
    }

    if (result.error === 'Invalid token' || !result.user_id) {
      throw new Error('Invalid token')
    }

    return {
      data: { tokenValid: result.token_valid, userId: result.user_id },
      error: null,
    }
  } catch (err) {
    console.error('confirmEmail - Unexpected error:', err)
    return { data: null, error: err as Error }
  }
}
