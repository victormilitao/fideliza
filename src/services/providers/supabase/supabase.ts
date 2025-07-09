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
import { getBusinessCardsByPersonId } from './api-functions/getBusinessCardsByPersonId'
import { signInWithCode } from './api-functions/signInWithCode'
import { createProfile } from './api-functions/createProfile'
import { getPersonByUserId } from './api-functions/getPersonByUserId'
import { sendSms } from './api-functions/sendSms'
import { getPersonById } from './api-functions/getPersonById'
import { sendAddStampMessage } from './api-functions/sendAddStampMessage'
import { getStampStructure } from './api-functions/getStampStructure'
import { generateCodeLogin } from './api-functions/customer/generateCodeLogin'
import { generateLoginToken } from './api-functions/generateLoginToken'
import { getPersonByToken } from './api-functions/customer/getPersonByToken'
import { getPersonByPhoneWithProfile } from './api-functions/getPersonByPhoneWithProfile'

const supabaseApi: ApiFunctions = {
  signInWithPassword: signInWithPassword,
  signInWithCode: signInWithCode,
  getMyBusiness: getMyBusiness,
  addStamp: addStamp,
  getUserLoggedIn: getUserLoggedIn,
  getPersonByPhone: getPersonByPhone,
  getPersonByPhoneWithProfile: getPersonByPhoneWithProfile,
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
  getBusinessCardsByPersonId: getBusinessCardsByPersonId,
  createProfile: createProfile,
  getPersonByUserId: getPersonByUserId,
  getPersonById: getPersonById,
  sendAddStampMessage: sendAddStampMessage,
  sendSms: sendSms,
  getStampStructure: getStampStructure,
  generateCodeLogin: generateCodeLogin,
  generateLoginToken: generateLoginToken,
  getPersonByToken: getPersonByToken,
}

export default supabaseApi
