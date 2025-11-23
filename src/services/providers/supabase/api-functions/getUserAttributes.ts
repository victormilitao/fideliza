import { ApiFunctions } from '@/services/types/api-functions.type'
import supabase from '../config'
import { Response } from '@/services/types/api.type'
import { UserAttributes } from '@/types/userAttributes.type'

export const getUserAttributes: ApiFunctions['getUserAttributes'] = async (
  userId: string
): Promise<Response<UserAttributes>> => {
  try {
    const { data, error } = await supabase
      .from('user_attributes')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      console.error('Error fetching user attributes by ID:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (error) {
    console.error('Unexpected error in getUserAttributes:', error)
    return { data: null, error: error as Error }
  }
}
