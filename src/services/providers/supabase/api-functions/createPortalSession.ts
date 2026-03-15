import { Response } from '@/services/types/api.type'
import supabase from '../config'

export const createPortalSession = async (
  customerId: string,
  returnUrl?: string
): Promise<Response<{ url: string }>> => {
  try {
    const computedReturnUrl: string = returnUrl ??
      (typeof window !== 'undefined'
        ? `${window.location.origin}/store/settings`
        : '/store/settings')

    const requestBody = {
      customer_id: customerId,
      return_url: computedReturnUrl,
    }

    const { data, error } = await supabase.functions.invoke('create-portal-session', {
      method: 'POST',
      body: requestBody,
    })

    if (error) {
      console.error('Failed to create portal session:', error)
      return { data: null, error }
    }

    if (!data || !data.url) {
      console.error('Invalid response from edge function:', data)
      return { data: null, error: new Error('Invalid response: url not found') }
    }

    return { data: { url: data.url as string }, error: null }
  } catch (error) {
    console.error('Error creating portal session:', error)
    return { data: null, error: error as Error }
  }
}
