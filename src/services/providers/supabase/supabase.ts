import { signInWithPassword } from './api-functions/signInWithPassword'
import { getMyBusiness } from './api-functions/getMyBusiness'
import { addStamp } from './api-functions/addStamp'
import { getUserLoggedIn } from './api-functions/getUserLoggedIn'
import { getUserByPhone } from './api-functions/getUserByPhone'
import { getStampsByUserId } from './api-functions/getStampsByUserId'
import { ApiFunctions } from '@/services/types/api-functions.type'
import { getProfile } from './api-functions/getProfile'
import { checkUserExists } from './api-functions/checkUserExists'
import { signUp } from './api-functions/signUp'
import { getMyActiveCampaigns } from './api-functions/getMyActiveCampaigns'

const supabaseApi: ApiFunctions = {
  signInWithPassword: signInWithPassword,
  getMyBusiness: getMyBusiness,
  addStamp: addStamp,
  getUserLoggedIn: getUserLoggedIn,
  getUserByPhone: getUserByPhone,
  getStampsByUserId: getStampsByUserId,
  getProfile: getProfile,
  checkUserExists: checkUserExists,
  signUp: signUp,
  getMyActiveCampaigns: getMyActiveCampaigns,
}

export default supabaseApi
