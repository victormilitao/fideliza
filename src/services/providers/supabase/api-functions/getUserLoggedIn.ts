import { Response } from '@/services/types/api.type'
import supabase from '../config'
import { User } from '@/types/user.type'

export const getUserLoggedIn = async (): Promise<Response<User>> => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    return {
      data: user || null,
      error: error || null,
    }
  } catch (err) {
    console.error('Unexpected error:', err)
    return { data: null, error: null }
  }
}
