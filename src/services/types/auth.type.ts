import { User } from "@/types/user.type"

export type SignInWithPasswordResponse = {
  access_token?: string
  user?: User
  session?: any
  weakPassword?: any
}

export type Credentials = {
  email: string
  password: string
}