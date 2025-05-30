import { Response } from '@/services/types/api.type'
import { Credentials } from '@/services/types/auth.type'
import supabase from '../config'
import { Person } from '@/types/person.type'

export const signInWithCode = async (
  credentials: Credentials,
  person: Person
): Promise<Response<boolean>> => {
  try {
    const { data, error } = await supabase
      .from('person_codes')
      .select()
      .eq('person_id', person.id)
      .eq('login', credentials.code)
      .maybeSingle()

    if (error) throw new Error('Failed to validate login code')

    return { data: !!data, error: null }
  } catch (err) {
    console.error('signInWithCode unexpected error:', err)
    return { data: null, error: null }
  }
}
