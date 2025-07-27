export const BUSINESS_OWNER = 'business_owner'
export const CUSTOMER = 'customer'

export type Profile = {
  id?: string
  role?: typeof BUSINESS_OWNER | typeof CUSTOMER
  user_id?: string
  person_id?: string
  verified?: string
}
