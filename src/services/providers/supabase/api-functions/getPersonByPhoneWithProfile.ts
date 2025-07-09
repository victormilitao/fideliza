import { Response } from '@/services/types/api.type'
import supabase from '../config'
import { Person } from '@/types/person.type'
import { CUSTOMER } from '@/types/profile'

export const getPersonByPhoneWithProfile = async (
  phone: string
): Promise<Response<Person>> => {
  try {
    const { data: person, error } = await supabase
      .from('person')
      .select('*, profiles!inner(*)')
      .eq('phone', phone)
      .eq('profiles.role', CUSTOMER)
      .maybeSingle()

    if (!person?.profiles) {
      return { data: null, error: null }
    }

    return {
      data: person || null,
      error: error || null,
    }
  } catch (err) {
    console.error('Unexpected error:', err)
    return { data: null, error: null }
  }
}
