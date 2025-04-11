import { Response } from '@/services/types/api.type'
import supabase from '../config'
import { Business } from '@/types/business.type'

export const getMyBusiness = async (): Promise<Response<Business>> => {
  try {
    let { data: business, error } = await supabase.from('business').select('*')
    const { id, created_at, name, user_id } = business?.[0]
    return {
      data: { id: id, createdAt: created_at, name, userId: user_id },
      error: error,
    }
  } catch (err) {
    console.error('Unexpected error:', err)
    return { data: null, error: null }
  }
}
