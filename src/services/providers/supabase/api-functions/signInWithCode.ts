import { Response } from '@/services/types/api.type'
import { Credentials } from '@/services/types/auth.type'

export const signInWithCode = async (
  credentials: Credentials
): Promise<Response<boolean>> => {
  try {
    const response = credentials.code === '5555'
    return { data: response, error: null }
  } catch (err) {
    console.error('Unexpected error:', err)
    return { data: null, error: null }
  }
}
