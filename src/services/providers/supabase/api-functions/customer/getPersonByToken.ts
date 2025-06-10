import { Response } from '@/services/types/api.type'
import supabase from '../../config'
import { Person } from '@/types/person.type'

export const getPersonByToken = async (
  token: string
): Promise<Response<Person>> => {
  try {
    const now = new Date()
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000)
    const { data, error } = await supabase
      .from('login_tokens')
      .select('expires_at, person(*)')
      .eq('token', token)
      .gte('expires_at', now.toISOString())
      .lte('expires_at', oneHourLater.toISOString())
      .maybeSingle()

    if (error || !data?.person) throw new Error('Person not found')

    return { data: data.person as Person, error: null }
  } catch (err) {
    console.error('getPersonByToken unexpected error:', err)
    return { data: null, error: err as Error }
  }
}
