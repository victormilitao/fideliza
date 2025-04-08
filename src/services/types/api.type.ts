export type Response<T> = {
  data: T | null
  error: Error | null
}

export type SignInWithPasswordResponse = {
  user?: any
  session?: any
  weakPassword?: any
}

export type Credentials = {
  email: string
  password: string
}
