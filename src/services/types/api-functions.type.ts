import { Business } from '@/types/business.type'
import { Response } from './api.type'
import { Credentials, SignInWithPasswordResponse } from './auth.type'
import { Stamp } from '@/types/stamp.type'
import { User } from '@/types/user.type'
import { Profile } from '@/types/profile'
import { Person } from '@/types/person.type'
import { Campaign } from '@/types/campaign.type'

export type ApiFunctions = {
  signInWithPassword: (
    credentials: Credentials
  ) => Promise<Response<SignInWithPasswordResponse>>
  getMyBusiness: (user: User) => Promise<Response<Business>>
  addStamp: ({ campaignId, userId }: Stamp) => void
  getUserLoggedIn: () => Promise<Response<User>>
  getUserByPhone: (phone: string) => Promise<Response<Person>>
  getStampsByUserId: (
    userId: string,
    businessId: string
  ) => Promise<Response<Stamp[]>>
  getProfile: (userId: string) => Promise<Response<Profile>>
  checkUserExists: (phone: string) => Promise<Response<User>>
  signUp: (phone: string) => Promise<Response<User>>
  getMyActiveCampaigns: (businessId: string) => Promise<Response<Campaign[]>>
}
