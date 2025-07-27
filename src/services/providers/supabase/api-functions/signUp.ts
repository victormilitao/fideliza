import { Response } from '@/services/types/api.type'
import supabase from '../config'
import { User } from '@/types/user.type'
import { ApiFunctions } from '@/services/types/api-functions.type'

export const signUp: ApiFunctions['signUp'] = async (
  phone: string,
  email?: string | null,
  password?: string | null
): Promise<Response<User>> => {
  try {
    const newEmail = email || `${phone}@fideliza.com`
    const newPassword = password || 'password'
    const { data, error } = await supabase.auth.signUp({
      email: newEmail,
      password: newPassword,
    })

    if (error || !data?.user) {
      console.error('Erro no signUp:', error)
      return { data: null, error }
    }

    return { data: data.user, error: error || null }
  } catch (err) {
    console.error('SIgnup - Unexpected error:', err)
    return { data: null, error: null }
  }
}
