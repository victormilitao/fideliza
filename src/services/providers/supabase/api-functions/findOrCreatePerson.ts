import { Response } from '@/services/types/api.type'
import supabase from '../config'
import { Person } from '@/types/person.type'
import api from '@/services/api'
import { CUSTOMER } from '@/types/profile'

export const findOrCreatePerson = async (
  phone: string
): Promise<Response<Person>> => {
  try {
    const { data: person } = await api.getPersonByPhoneWithProfile(phone)

    if (person) return { data: person, error: null }

    const { data: user, error: signUpError } = await api.signUp(phone)
    if (!user?.id || signUpError) {
      console.error('Erro no signUp:', signUpError)
      return { data: null, error: signUpError }
    }

    const { data: newPerson, error: personError } = await supabase
      .from('person')
      .insert([{ user_id: user?.id, phone: phone }])
      .select()
      .maybeSingle()

    if (!newPerson?.id || personError) {
      console.error('findOrCreatePerson - error:', personError?.message)
      return { data: null, error: personError }
    }

    const { data: profile, error: profileError } = await api.createProfile(
      user?.id, newPerson?.id, CUSTOMER
    )

    if (profileError || !profile) {
      console.error('Erro no createProfile:', profileError)
      return { data: null, error: profileError }
    }

    return { data: newPerson, error: null }
  } catch (err) {
    console.error('SIgnup - Unexpected error:', err)
    return { data: null, error: null }
  }
}
