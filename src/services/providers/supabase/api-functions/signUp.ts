import { Response } from '@/services/types/api.type'
import supabase from '../config'
import { User } from '@/types/user.type'

export const signUp = async (phone: string): Promise<Response<User>> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: `${phone}@fideliza.com`,
      password: 'password',
    })

    if (error || !data?.user) {
      console.error('Erro no signUp:', error)
      return { data: null, error }
    }

    return { data: data.user, error: error || null }
  } catch (err) {
    console.error('SIgnup - Unexpected error:', err)
    return { data: null, error: null }
  }
}
