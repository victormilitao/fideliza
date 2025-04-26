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

    const { data: _, error: personError } = await supabase
      .from('person')
      .insert([
        {
          user_id: data.user.id,
          phone: phone,
        },
      ])

    if (personError) {
      console.error('Signup - creating person:', personError.message)
    }

    return {
      data: data.user || null,
      error: error || null,
    }
  } catch (err) {
    console.error('SIgnup - Unexpected error:', err)
    return { data: null, error: null }
  }
}
