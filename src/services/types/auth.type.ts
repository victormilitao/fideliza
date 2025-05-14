import { Profile } from "@/types/profile"
import { User } from "@/types/user.type"

export type SignInWithPasswordResponse = {
  session?: Session | null
  user: User | null
  profile?: Profile | null
}

export type Session = {
  access_token: string
  user: User
}

export type Credentials = {
  email: string
  password: string
  code?: string
}