import { Response } from '@/services/types/api.type'
import supabase from '../config'

export const stripeRequest = async (
  priceId: string
): Promise<Response<{ clientSecret: string }>> => {
  try {
    console.log('Creating checkout session with priceId:', priceId)
    
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      method: 'POST',
      body: { priceId },
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

    return { data: { clientSecret: data.clientSecret as string }, error: null }
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error)
    return { data: null, error: error as Error }
  }
}

export const stripeSessionStatus = async (
  sessionId: string
): Promise<Response<{ status: string; customer_email: string | null }>> => {
  try {
    console.log('Getting session status for sessionId:', sessionId)
    
    const { data, error } = await supabase.functions.invoke('session-status', {
      method: 'GET',
      body: {
        session_id: sessionId,
      },
    })

    if (error) {
      console.error('Failed to get session status:', error)
      return { data: null, error }
    }

    console.log('Session status data:', data)
    return { data: data as { status: string; customer_email: string | null }, error: null }
  } catch (error) {
    console.error('Error getting session status:', error)
    return { data: null, error: error as Error }
  }
}

