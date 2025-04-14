import { Business } from '@/types/business.type'
import { Response } from './api.type'
import { Credentials, SignInWithPasswordResponse } from './auth.type'
import { Stamp } from '@/types/stamp.type'
import { User } from '@/types/user.type'

export type ApiFunctions = {
  signInWithPassword: (
    credentials: Credentials
  ) => Promise<Response<SignInWithPasswordResponse>>
  getMyBusiness: (user: User) => Promise<Response<Business>>
  addStamp: ({ businessId, userId }: Stamp) => void
  getUserLoggedIn: () => Promise<Response<User>>
  getUserByPhone: (phone: string) => Promise<Response<User>>
  getStampsByUserId: (
    userId: string,
    businessId: string
  ) => Promise<Response<Stamp[]>>
}
