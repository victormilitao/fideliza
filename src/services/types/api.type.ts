export type Response<T> = {
  data: T | null
  error: Error | null
}
