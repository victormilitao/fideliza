import { signInWithPassword } from './api-functions/signInWithPassword'
import { getMyBusiness } from './api-functions/getMyBusiness'
import { addStamp } from './api-functions/addStamp'
import { getUserLoggedIn } from './api-functions/getUserLoggedIn'
import { getPersonByPhone } from './api-functions/getUserByPhone'
import { getStampsByUserId } from './api-functions/getStampsByUserId'
import { ApiFunctions } from '@/services/types/api-functions.type'
import { getProfile } from './api-functions/getProfile'
import { checkUserExists } from './api-functions/checkUserExists'
import { signUp } from './api-functions/signUp'
import { getMyActiveCampaigns } from './api-functions/getMyActiveCampaigns'
import { findOrCreatePerson } from './api-functions/findOrCreatePerson'
import { findOrCreateCard } from './api-functions/findOrCreateCard'
import { findCurrentCard } from './api-functions/findCurrentCard'

const supabaseApi: ApiFunctions = {
  signInWithPassword: signInWithPassword,
  getMyBusiness: getMyBusiness,
  addStamp: addStamp,
  getUserLoggedIn: getUserLoggedIn,
  getPersonByPhone: getPersonByPhone,
  getStampsByUserId: getStampsByUserId,
  getProfile: getProfile,
  checkUserExists: checkUserExists,
  signUp: signUp,
  getMyActiveCampaigns: getMyActiveCampaigns,
  findOrCreatePerson: findOrCreatePerson,
  findOrCreateCard: findOrCreateCard,
  findCurrentCard: findCurrentCard,
}

export default supabaseApi
