import { Credentials, Response, SignInWithPasswordResponse } from './api.type'

export type ApiFunctions = {
  signInWithPassword: (
    credentials: Credentials
  ) => Promise<Response<SignInWithPasswordResponse>>
}
