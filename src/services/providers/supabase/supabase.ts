import { ApiFunctions } from '@/services/types/api-functions.type'
import { signInWithPassword } from './api-functions/signInWithPassword'
import { getMyBusiness } from './api-functions/getMyBusiness'
import { addStamp } from './api-functions/addStamp'

const supabaseApi: ApiFunctions = {
  signInWithPassword: signInWithPassword,
  getMyBusiness: getMyBusiness,
  addStamp: addStamp,
}

export default supabaseApi
