import { Credentials, SignInWithPasswordResponse } from "./api.type"

export type ApiFunctions = {
  signInWithPassword: (credentials: Credentials) => Promise<SignInWithPasswordResponse>,
}