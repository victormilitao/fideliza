import { Business } from '@/types/business.type'
import { Response } from './api.type'
import { Credentials, SignInWithPasswordResponse } from './auth.type'
import { Stamp } from '@/types/stamp.type'

export type ApiFunctions = {
  signInWithPassword: (
    credentials: Credentials
  ) => Promise<Response<SignInWithPasswordResponse>>
  getMyBusiness: () => Promise<Response<Business>>
  addStamp: ({ businessId, userId }: Stamp) => void
}
