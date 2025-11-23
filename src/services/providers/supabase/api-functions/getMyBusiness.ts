import { Response } from '@/services/types/api.type'
import supabase from '../config'
import { Business } from '@/types/business.type'
import { User } from '@/types/user.type'

export const getMyBusiness = async (
  user: User
): Promise<Response<Business>> => {
  try {
    const { data: business, error } = await supabase
      .from('business')
      .select('*')
      .eq('user_id', user?.id)
      .maybeSingle()

    return {
      data: business || null,
      error: error || null,
    }
  } catch (err) {
    console.error('Unexpected error:', err)
    return { data: null, error: null }
  }
}
