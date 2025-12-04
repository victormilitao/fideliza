export type BusinessSubscription = {
  id?: string
  business_id: string
  stripe_customer_id: string
  stripe_subscription_id: string | null
  stripe_session_id: string | null
  payment_status: string
  subscription_status: string | null
  status: string
  created_at?: string
  updated_at?: string
}

