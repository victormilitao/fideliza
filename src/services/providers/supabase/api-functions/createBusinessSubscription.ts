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

    // Verificar se já existe uma subscription ativa ou pendente para este business_id
    const { data: existingSubscription, error: fetchError } = await supabase
      .from('business_subscriptions')
      .select('*')
      .eq('business_id', subscription.business_id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (fetchError) {
      console.error('Error checking existing subscription:', fetchError)
      return { data: null, error: fetchError }
    }

    // Se já existe uma subscription
    if (existingSubscription) {
      const hasActiveOrPendingStatus = 
        existingSubscription.status === 'complete' || 
        existingSubscription.status === 'pending' || 
        existingSubscription.status === 'open'

      if (hasActiveOrPendingStatus) {
        // Se já existe subscription completa, retornar erro
        if (existingSubscription.status === 'complete') {
          const errorMsg = 'Já existe uma assinatura ativa para este estabelecimento'
          console.error(errorMsg)
          return { data: null, error: new Error(errorMsg) }
        }

        // Se existe subscription "open" ou "pending" com session_id diferente, atualizar
        if ((existingSubscription.status === 'open' || existingSubscription.status === 'pending') &&
            existingSubscription.stripe_session_id !== subscription.stripe_session_id &&
            subscription.stripe_session_id) {
          console.log('Atualizando session_id existente:', {
            oldSessionId: existingSubscription.stripe_session_id,
            newSessionId: subscription.stripe_session_id
          })

          const { data: updated, error: updateError } = await supabase
            .from('business_subscriptions')
            .update({
              stripe_session_id: subscription.stripe_session_id,
              payment_status: subscription.payment_status,
              status: subscription.status,
            })
            .eq('id', existingSubscription.id)
            .select()
            .single()

          if (updateError) {
            console.error('Error updating subscription:', updateError)
            return { data: null, error: updateError }
          }

          console.log('Subscription updated successfully:', updated)
          return { data: updated, error: null }
        }

        // Se já existe subscription com mesmo session_id ou status incompatível, retornar existente
        console.log('Já existe uma subscription ativa ou pendente, retornando existente:', existingSubscription)
        return { data: existingSubscription, error: null }
      }
    }

    // Se não existe subscription ativa/pendente, criar novo registro
    console.log('Criando nova subscription')
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


