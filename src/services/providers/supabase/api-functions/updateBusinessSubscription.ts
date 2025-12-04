import { Response } from '@/services/types/api.type'
import supabase from '../config'
import { BusinessSubscription } from '@/types/businessSubscription.type'

export const updateBusinessSubscription = async (
  subscription: Omit<BusinessSubscription, 'id' | 'created_at' | 'updated_at'>
): Promise<Response<BusinessSubscription>> => {
  try {
    console.log('Updating business subscription:', subscription)

    // Para atualizar, precisa ter stripe_session_id
    if (!subscription.stripe_session_id) {
      const errorMsg = 'stripe_session_id é obrigatório para atualizar subscription'
      console.error(errorMsg)
      return { data: null, error: new Error(errorMsg) }
    }

    // Buscar registro existente pelo session_id
    const { data: existing, error: findError } = await supabase
      .from('business_subscriptions')
      .select('*')
      .eq('stripe_session_id', subscription.stripe_session_id)
      .maybeSingle()

    if (findError) {
      console.error('Error finding by session_id:', findError)
      return { data: null, error: findError }
    }

    if (!existing) {
      const errorMsg = `Subscription com stripe_session_id ${subscription.stripe_session_id} não encontrada`
      console.error(errorMsg)
      return { data: null, error: new Error(errorMsg) }
    }

    // UPDATE: Atualizar apenas os campos que mudaram, mantendo business_id e stripe_session_id
    const { data: updated, error: updateError } = await supabase
      .from('business_subscriptions')
      .update({
        stripe_customer_id: subscription.stripe_customer_id,
        stripe_subscription_id: subscription.stripe_subscription_id,
        payment_status: subscription.payment_status,
        subscription_status: subscription.subscription_status,
        status: subscription.status,
        // business_id e stripe_session_id são mantidos (não atualizados)
      })
      .eq('id', existing.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating subscription:', updateError)
      return { data: null, error: updateError }
    }

    console.log('Subscription updated successfully:', updated)
    return { data: updated, error: null }
  } catch (error) {
    console.error('Error updating business subscription (catch):', error)
    return { data: null, error: error as Error }
  }
}


