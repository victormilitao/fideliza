import { Response } from '@/services/types/api.type'
import supabase from '../config'
import { BusinessSubscription } from '@/types/businessSubscription.type'

export const createBusinessSubscription = async (
  subscription: Omit<BusinessSubscription, 'id' | 'created_at' | 'updated_at'>
): Promise<Response<BusinessSubscription>> => {
  try {
    console.log('Creating business subscription:', subscription)

    // Validar que business_id está presente
    if (!subscription.business_id || subscription.business_id.trim() === '') {
      const errorMsg = 'business_id é obrigatório para criar nova subscription'
      console.error(errorMsg)
      return { data: null, error: new Error(errorMsg) }
    }

    const { data: created, error: insertError } = await supabase
      .from('business_subscriptions')
      .insert([subscription])
      .select()
      .single()

    if (insertError) {
      console.error('Error creating subscription:', insertError)
      return { data: null, error: insertError }
    }

    console.log('Subscription created successfully:', created)
    return { data: created, error: null }
  } catch (error) {
    console.error('Error creating business subscription (catch):', error)
    return { data: null, error: error as Error }
  }
}


