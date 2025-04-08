import { Credentials } from '@/services/types/api.type'
import supabase from '../config'

export const signInWithPassword = async (credentials: Credentials) => {
  try {
    return await supabase.auth.signInWithPassword(credentials)
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}
