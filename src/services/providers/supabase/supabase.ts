import { signInWithPassword } from './api-functions/signInWithPassword'
import { getMyBusiness } from './api-functions/getMyBusiness'
import { addStamp } from './api-functions/addStamp'
import { getUserLoggedIn } from './api-functions/getUserLoggedIn'
import { getUserByPhone } from './api-functions/getUserByPhone'
import { getStampsByUserId } from './api-functions/getStampsByUserId'
import { ApiFunctions } from '@/services/types/api-functions.type'
import { getProfile } from './api-functions/getProfile'

const supabaseApi: ApiFunctions = {
  signInWithPassword: signInWithPassword,
  getMyBusiness: getMyBusiness,
  addStamp: addStamp,
  getUserLoggedIn: getUserLoggedIn,
  getUserByPhone: getUserByPhone,
  getStampsByUserId: getStampsByUserId,
  getProfile: getProfile,
}

export default supabaseApi
