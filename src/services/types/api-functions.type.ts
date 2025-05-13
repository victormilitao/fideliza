import { Business } from '@/types/business.type'
import { Response } from './api.type'
import { Credentials, SignInWithPasswordResponse } from './auth.type'
import { Stamp } from '@/types/stamp.type'
import { User } from '@/types/user.type'
import { Profile } from '@/types/profile'
import { Person } from '@/types/person.type'
import { Campaign } from '@/types/campaign.type'
import { Card } from '@/types/card.type'

export type ApiFunctions = {
  signInWithPassword: (
    credentials: Credentials
  ) => Promise<Response<SignInWithPasswordResponse>>
  signInWithCode: (credentials: Credentials) => Promise<Response<boolean>>
  getMyBusiness: (user: User) => Promise<Response<Business>>
  addStamp: (personId: string, campaignId: string) => Promise<Response<Stamp>>
  getUserLoggedIn: () => Promise<Response<User>>
  getPersonByPhone: (phone: string) => Promise<Response<Person>>
  getStampsByUserId: (
    userId: string,
    businessId: string
  ) => Promise<Response<Stamp[]>>
  getProfile: (userId: string) => Promise<Response<Profile>>
  checkUserExists: (phone: string) => Promise<Response<User>>
  signUp: (phone: string) => Promise<Response<User>>
  getMyActiveCampaigns: (businessId: string) => Promise<Response<Campaign[]>>
  findOrCreatePerson: (phone: string) => Promise<Response<Person>>
  findOrCreateCard: (
    personId: string,
    campaignId: string
  ) => Promise<Response<Card>>
  findCurrentCard: (
    personId: string,
    campaignId: string
  ) => Promise<Response<Card>>
  getStampsByCardId(cardId: string): Promise<Response<Stamp[]>>
  getCampaignById: (campaignId: string) => Promise<Response<Campaign>>
  checkCompletedCard: (
    cardId: string,
    campaignId: string
  ) => Promise<Response<boolean>>
  markCardAsCompleted: (cardId: string) => Promise<Response<Card>>
  findCompletedCard: (personId: string) => Promise<Response<Card>>
  reward: (cardId: string, code: string) => Promise<Response<boolean>>
  getCardsByPersonId: (personId: string) => Promise<Response<Card[]>>
}
