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
import { sendWhatsapp } from './api-functions/sendWhatsapp'
import { getPersonById } from './api-functions/getPersonById'
import { sendAddStampMessage } from './api-functions/sendAddStampMessage'
import { getStampStructure } from './api-functions/getStampStructure'
import { generateCodeLogin } from './api-functions/customer/generateCodeLogin'
import { generateLoginToken } from './api-functions/generateLoginToken'
import { getPersonByToken } from './api-functions/customer/getPersonByToken'
import { getPersonByPhoneWithProfile } from './api-functions/getPersonByPhoneWithProfile'
import { sendEmail } from './api-functions/sendEmail'
import { logout } from './api-functions/logout'
import { generateEmailConfirmationToken } from './api-functions/business/generatetEmailConfirmationToken'
import { confirmEmail } from './api-functions/business/confirmEmail'
import { verifyProfile } from './api-functions/verifyProfile'
import { getUserAttributes } from './api-functions/getUserAttributes'
import { createBusiness } from './api-functions/business/createBusiness'
import { createCampaign } from './api-functions/business/createCampaign'
import { sendEmailConfirmation, sendTestEmail } from '@/services/email/emailjs'
import { getCampaignCards } from './api-functions/getCampaignCards'

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
  sendWhatsapp: sendWhatsapp,
  getStampStructure: getStampStructure,
  generateCodeLogin: generateCodeLogin,
  generateLoginToken: generateLoginToken,
  getPersonByToken: getPersonByToken,
  sendEmail: sendEmail,
  logout: logout,
  generateEmailConfirmationToken: generateEmailConfirmationToken,
  confirmEmail: confirmEmail,
  verifyProfile: verifyProfile,
  getUserAttributes: getUserAttributes,
  createBusiness: createBusiness,
  createCampaign: createCampaign,
  sendEmailConfirmation: sendEmailConfirmation,
  sendTestEmail: sendTestEmail,
  getCampaignCards: getCampaignCards,
}

export default supabaseApi
