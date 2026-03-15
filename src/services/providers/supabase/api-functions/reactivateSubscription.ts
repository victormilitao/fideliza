import { Response } from '@/services/types/api.type'
import supabase from '../config'

export const reactivateSubscription = async (
  subscriptionId: string
): Promise<Response<any>> => {
  try {
    console.log('Reactivating subscription for subscriptionId:', subscriptionId)

    const requestBody = {
      subscription_id: subscriptionId,
    }

    const { data, error } = await supabase.functions.invoke('reactivate-subscription', {
      method: 'POST',
      body: requestBody,
    })

    if (error) {
      console.error('Failed to reactivate subscription:', error)
      return { data: null, error }
    }

    console.log('Subscription reactivated successfully:', data)
    return { data, error: null }
  } catch (error) {
    console.error('Error reactivating subscription (catch):', error)
    return { data: null, error: error as Error }
  }
}
