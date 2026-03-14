import { Response } from '@/services/types/api.type'
import supabase from '../config'

export const updatePassword = async (
  password: string
): Promise<Response<boolean>> => {
  try {
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      return { data: false, error }
    }

    return { data: true, error: null }
  } catch (err) {
    console.error('Unexpected error:', err)
    return { data: false, error: null }
  }
}
