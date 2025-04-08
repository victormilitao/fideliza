import {
  Credentials,
  Response,
  SignInWithPasswordResponse,
} from '@/services/types/api.type'
import supabase from '../config'

export const signInWithPassword = async (
  credentials: Credentials
): Promise<Response<SignInWithPasswordResponse>> => {
  try {
    const response = await supabase.auth.signInWithPassword(credentials)
    return { data: { user: response.data.user }, error: response.error }
  } catch (err) {
    console.error('Unexpected error:', err)
    return { data: null, error: null }
  }
}
