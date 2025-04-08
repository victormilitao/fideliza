import { ApiFunctions } from '@/services/types/api-functions.type'
import { signInWithPassword } from './api-functions/signInWithPassword'

const supabaseApi: ApiFunctions = {
  signInWithPassword: signInWithPassword,
}

export default supabaseApi
