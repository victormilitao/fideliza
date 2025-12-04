import { Response } from '@/services/types/api.type'
import supabase from '../config'
import { BusinessSubscription } from '@/types/businessSubscription.type'

export const getBusinessSubscriptionByBusinessId = async (
  businessId: string
): Promise<Response<BusinessSubscription | null>> => {
  try {
    console.log('Getting business subscription by businessId:', businessId)

    const { data, error } = await supabase
      .from('business_subscriptions')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error('Error getting business subscription:', error)
      return { data: null, error }
    }

    console.log('Business subscription data:', data)
    return { data: data || null, error: null }
  } catch (error) {
    console.error('Error getting business subscription (catch):', error)
    return { data: null, error: error as Error }
  }
}

