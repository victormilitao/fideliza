import { Response } from '@/services/types/api.type'
import supabase from '../config'
import { Person } from '@/types/person.type'

export const getPersonByUserId = async (
  userId: string
): Promise<Response<Person>> => {
  try {
    const { data: person, error } = await supabase
      .from('person')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    return {
      data: person || null,
      error: error || null,
    }
  } catch (err) {
    console.error('Unexpected error:', err)
    return { data: null, error: null }
  }
}
