import { Response } from '@/services/types/api.type'
import supabase from '../config'
import { BusinessSubscription } from '@/types/businessSubscription.type'

export const saveBusinessSubscription = async (
  subscription: Omit<BusinessSubscription, 'id' | 'created_at' | 'updated_at'>
): Promise<Response<BusinessSubscription>> => {
  try {
    console.log('Saving business subscription:', subscription)

    // CASO 1: UPDATE - Se tem stripe_session_id, buscar registro existente e atualizar
    if (subscription.stripe_session_id) {
      const { data: existing, error: findError } = await supabase
        .from('business_subscriptions')
        .select('*')
        .eq('stripe_session_id', subscription.stripe_session_id)
        .maybeSingle()

      if (findError) {
        console.error('Error finding by session_id:', findError)
        return { data: null, error: findError }
      }

      if (existing) {
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
      }
    }

    // CASO 2: INSERT - Criar novo registro
    // Se chegou aqui, não encontrou registro existente pelo session_id
    // Para criar novo, precisa de business_id válido
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
    console.error('Error saving business subscription (catch):', error)
    return { data: null, error: error as Error }
  }
}
