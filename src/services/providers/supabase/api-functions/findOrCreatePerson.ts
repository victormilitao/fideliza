import { Response } from '@/services/types/api.type'
import supabase from '../config'
import { Person } from '@/types/person.type'
import api from '@/services/api'

export const findOrCreatePerson = async (
  phone: string
): Promise<Response<Person>> => {
  try {
    const { data: person } = await api.getPersonByPhone(phone)

    if (person) return { data: person, error: null }

    const { data: user } = await api.signUp(phone)

    const { data: newPerson, error: personError } = await supabase
      .from('person')
      .insert([{ user_id: user?.id, phone: phone }])

    if (personError) {
      console.error('findOrCreatePerson - error:', personError.message)
      return { data: null, error: personError }
    }

    return { data: newPerson, error: null }
  } catch (err) {
    console.error('SIgnup - Unexpected error:', err)
    return { data: null, error: null }
  }
}
