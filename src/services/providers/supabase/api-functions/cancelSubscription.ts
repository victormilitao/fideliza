import { Response } from '@/services/types/api.type'
import supabase from '../config'

export const cancelSubscription = async (
  subscriptionId: string
): Promise<Response<any>> => {
  try {
    console.log('Canceling subscription for subscriptionId:', subscriptionId)
    console.log('Calling edge function: cancel-subscription')
    
    const requestBody = {
      subscription_id: subscriptionId,
    }
    console.log('Request body:', requestBody)
    
    const { data, error } = await supabase.functions.invoke('cancel-subscription', {
      method: 'POST',
      body: requestBody,
    })

    console.log('Edge function response - data:', data)
    console.log('Edge function response - error:', error)

    if (error) {
      console.error('Failed to cancel subscription:', error)
      return { data: null, error }
    }

    console.log('Subscription canceled successfully:', data)
    return { data, error: null }
  } catch (error) {
    console.error('Error canceling subscription (catch):', error)
    return { data: null, error: error as Error }
  }
}

