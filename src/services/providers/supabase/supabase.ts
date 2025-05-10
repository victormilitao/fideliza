import { signInWithPassword } from './api-functions/signInWithPassword'
import { getMyBusiness } from './api-functions/getMyBusiness'
import { addStamp } from './api-functions/addStamp'
import { getUserLoggedIn } from './api-functions/getUserLoggedIn'
import { getPersonByPhone } from './api-functions/getPersonByPhone'
import { getStampsByUserId } from './api-functions/getStampsByUserId'
import { ApiFunctions } from '@/services/types/api-functions.type'
import { getProfile } from './api-functions/getProfile'
import { checkUserExists } from './api-functions/checkUserExists'
import { signUp } from './api-functions/signUp'
import { getMyActiveCampaigns } from './api-functions/getMyActiveCampaigns'
import { findOrCreatePerson } from './api-functions/findOrCreatePerson'
import { findOrCreateCard } from './api-functions/findOrCreateCard'
import { findCurrentCard } from './api-functions/findCurrentCard'
import { getStampsByCardId } from './api-functions/getStampsByCardId'
import { getCampaignById } from './api-functions/getCampaignById'
import { checkCompletedCard } from './api-functions/checkCompletedCard'
import { markCardAsCompleted } from './api-functions/markCardAsCompleted'
import { findCompletedCard } from './api-functions/findCompletedCard'
import { reward } from './api-functions/reward'

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
  getStampsByCardId: getStampsByCardId,
  getCampaignById: getCampaignById,
  checkCompletedCard: checkCompletedCard,
  markCardAsCompleted: markCardAsCompleted,
  findCompletedCard: findCompletedCard,
  reward: reward,
}

export default supabaseApi
