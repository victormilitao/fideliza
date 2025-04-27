import { Response } from '@/services/types/api.type'
import supabase from '../config'
import { User } from '@/types/user.type'

export const checkUserExists = async (
  phone: string
): Promise<Response<User>> => {
  try {
    let { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('phone', phone)
      .single()

    return {
      data: data || null,
      error: error || null,
    }
  } catch (err) {
    console.error('checkUserExists - Unexpected error:', err)
    return { data: null, error: null }
  }
}
