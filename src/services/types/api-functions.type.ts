import { Credentials } from "./api.type"

export type ApiFunctions = {
  signInWithPassword: (credentials: Credentials) => Promise<any>
}