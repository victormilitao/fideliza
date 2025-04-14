import { Response } from '@/services/types/api.type'
import supabase from '../config'
import {
  Credentials,
  SignInWithPasswordResponse,
} from '@/services/types/auth.type'

export const signInWithPassword = async (
  credentials: Credentials
): Promise<Response<SignInWithPasswordResponse>> => {
  try {
    const response = await supabase.auth.signInWithPassword(credentials)
    return { data: response.data, error: response.error }
  } catch (err) {
    console.error('Unexpected error:', err)
    return { data: null, error: null }
  }
}
