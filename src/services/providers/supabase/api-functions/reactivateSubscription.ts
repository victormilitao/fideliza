import { Response } from '@/services/types/api.type'

export const reactivateSubscription = async (
  subscriptionId: string
): Promise<Response<any>> => {
  try {
    console.log('Reactivating subscription for subscriptionId:', subscriptionId)

    const response = await fetch('/api/stripe/reactivate-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription_id: subscriptionId }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Failed to reactivate subscription:', data.error)
      return { data: null, error: new Error(data.error) }
    }

    console.log('Subscription reactivated successfully:', data)
    return { data, error: null }
  } catch (error) {
    console.error('Error reactivating subscription (catch):', error)
    return { data: null, error: error as Error }
  }
}
