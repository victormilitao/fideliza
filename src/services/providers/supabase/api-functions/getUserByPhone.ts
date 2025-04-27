import { Response } from '@/services/types/api.type'
import supabase from '../config'
import { Person } from '@/types/person.type'

export const getUserByPhone = async (
  phone: string
): Promise<Response<Person>> => {
  try {
    const { data: person, error } = await supabase
      .from('person')
      .select('*')
      .eq('phone', phone)
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
