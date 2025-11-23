import { ApiFunctions } from '@/services/types/api-functions.type'
import supabase from '../config'
import { Response } from '@/services/types/api.type'

export const logout: ApiFunctions['logout'] = async (): Promise<
  Response<boolean>
> => {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      console.error('Logout failed:', error)
      return { data: false, error }
    }

    return { data: true, error: null }
  } catch (err) {
    console.error('Unexpected error during logout:', err)
    return { data: false, error: null }
  }
}
