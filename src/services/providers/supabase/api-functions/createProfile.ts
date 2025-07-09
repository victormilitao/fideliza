import { CUSTOMER, Profile } from '@/types/profile'
import supabase from '../config'
import { Response } from '@/services/types/api.type'

export const createProfile = async (
  userId: string,
  personId: string
): Promise<Response<Profile>> => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert([{ user_id: userId, role: CUSTOMER, person_id: personId }])
      .select()
      .maybeSingle()

    if (error || !data) {
      console.error('Erro no createProfile:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (err) {
    console.error('createProfile - Unexpected error:', err)
    return { data: null, error: err as Error }
  }
}
