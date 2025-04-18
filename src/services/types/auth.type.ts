import { User } from "@/types/user.type"

export type SignInWithPasswordResponse = {
  session?: Session | null
  user: User | null
}

export type Session = {
  access_token: string
}

export type Credentials = {
  email: string
  password: string
}