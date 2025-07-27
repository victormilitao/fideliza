import { ApiFunctions } from '@/services/types/api-functions.type'
import supabase from '../config'

export const verifyProfile: ApiFunctions['verifyProfile'] = async (
  userId: string
) => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ verified: new Date() })
      .eq('user_id', userId)
      .select()
      .maybeSingle()

    if (error || !data) {
      console.error('verifyProfile - Error updating profile:', error)
      return { data: null, error }
    }

    return { data: true, error: null }
  } catch (err) {
    console.error('verifyProfile - Unexpected error:', err)
    return { data: false, error: err as Error }
  }
}
