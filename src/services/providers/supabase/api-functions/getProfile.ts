import { Response } from '@/services/types/api.type'
import supabase from '../config'
import { Profile } from '@/types/profile'

export const getProfile = async (
  userId: string
): Promise<Response<Profile>> => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    return {
      data: profile || null,
      error: error || null,
    }
  } catch (err) {
    console.error('Unexpected error:', err)
    return { data: null, error: null }
  }
}
