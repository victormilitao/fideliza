import supabase from './config'
import { Credentials } from '@/services/types/api.type'
import { ApiFunctions } from '@/services/types/api-functions.type'

const supabaseApi: ApiFunctions = {
  signInWithPassword: async (credentials: Credentials) => {
    try {
      return await supabase.auth.signInWithPassword(credentials)
    } catch (err) {
      console.error('Unexpected error:', err)
    }
  },
}

export default supabaseApi
