import { Response } from '@/services/types/api.type'
import supabase from '../config'

export const stripeRequest = async (
  priceId: string,
  customerEmail?: string
): Promise<Response<{ clientSecret: string; sessionId: string | null }>> => {
  try {
    // Construir return_url dinamicamente quando a função é chamada
    // para evitar erros em ambientes não-browser (SSR, testes, etc.)
    const return_url = typeof window !== 'undefined' 
      ? `${window.location.origin}/store/payment/success?session_id={CHECKOUT_SESSION_ID}`
      : '/store/payment/success?session_id={CHECKOUT_SESSION_ID}'
    
    console.log('Creating checkout session with priceId:', priceId)
    
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      method: 'POST',
      body: { priceId, return_url, customer_email: customerEmail },
    })

    if (error) {
      console.error('Failed to create Stripe checkout session:', error)
      return { data: null, error }
    }

    console.log('Response data:', data)
    
    // Verificar se data tem clientSecret
    if (!data || !data.clientSecret) {
      console.error('Invalid response from edge function:', data)
      return { 
        data: null, 
        error: new Error('Invalid response: clientSecret not found') 
      }
    }

    return { 
      data: { 
        clientSecret: data.clientSecret as string,
        sessionId: data.sessionId || null,
      }, 
      error: null 
    }
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error)
    return { data: null, error: error as Error }
  }
}

export const stripeSessionStatus = async (
  sessionId: string
): Promise<Response<{ 
  status: string
  customer_email: string | null
  payment_status: string
  subscription: string | null
  customer: string
}>> => {
  try {
    console.log('Getting session status for sessionId:', sessionId)
    console.log('Calling edge function: session-status')
    
    const requestBody = {
      session_id: sessionId,
    }
    console.log('Request body:', requestBody)
    
    const { data, error } = await supabase.functions.invoke('session-status', {
      method: 'POST',
      body: requestBody,
    })

    console.log('Edge function response - data:', data)
    console.log('Edge function response - error:', error)

    if (error) {
      console.error('Failed to get session status:', error)
      return { data: null, error }
    }

    console.log('Session status data:', data)
    
    // A resposta da edge function tem: success, status, payment_status, subscription, customer
    if (data && typeof data === 'object' && 'status' in data && 'payment_status' in data && 'customer' in data) {
      return { 
        data: {
          status: data.status as string,
          customer_email: data.customer_email || null,
          payment_status: data.payment_status as string,
          subscription: data.subscription || null,
          customer: data.customer as string,
        }, 
        error: null 
      }
    }

    return { data: null, error: new Error('Invalid response format') }
  } catch (error) {
    console.error('Error getting session status (catch):', error)
    return { data: null, error: error as Error }
  }
}

export const getSubscriptionInfo = async (
  subscriptionId: string
): Promise<Response<any>> => {
  try {
    console.log('Getting subscription info for subscriptionId:', subscriptionId)
    console.log('Calling edge function: get-subscription-info')
    
    const requestBody = {
      subscription_id: subscriptionId,
    }
    console.log('Request body:', requestBody)
    
    const { data, error } = await supabase.functions.invoke('get-subscription-info', {
      method: 'POST',
      body: requestBody,
    })

    console.log('Edge function response - data:', data)
    console.log('Edge function response - error:', error)

    if (error) {
      console.error('Failed to get subscription info:', error)
      return { data: null, error }
    }

    console.log('Subscription info data:', data)
    return { data, error: null }
  } catch (error) {
    console.error('Error getting subscription info (catch):', error)
    return { data: null, error: error as Error }
  }
}

