import { useMyBusiness } from '@/hooks/useMyBusiness'
import { useBusinessSubscription } from '@/hooks/useBusinessSubscription'
import { Button } from '@/components/button/button'
import { Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import api from '@/services/api'
import { useQueryClient } from '@tanstack/react-query'

export const MyAccount = () => {
  const { business } = useMyBusiness()
  const { subscription, isLoading } = useBusinessSubscription(business?.id)
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isCanceling, setIsCanceling] = useState(false)

  const isActive: boolean = subscription?.status === 'complete' || subscription?.status === 'active'
  const isCancelled: boolean = subscription?.subscription_status === 'canceled'

  const handleCancelSubscription = useCallback(async () => {
    if (!subscription?.stripe_subscription_id) return

    const confirmed: boolean = window.confirm(
      'Tem certeza que deseja cancelar sua assinatura? Esta ação não pode ser desfeita.'
    )
    if (!confirmed) return

    setIsCanceling(true)
    try {
      const { error: cancelError } = await api.cancelSubscription(
        subscription.stripe_subscription_id
      )
      if (cancelError) throw cancelError

      await api.updateBusinessSubscription({
        business_id: subscription.business_id,
        stripe_customer_id: subscription.stripe_customer_id,
        stripe_subscription_id: subscription.stripe_subscription_id,
        stripe_session_id: subscription.stripe_session_id,
        payment_status: subscription.payment_status,
        subscription_status: 'canceled',
        status: 'canceled',
      })

      if (business?.id) {
        queryClient.invalidateQueries({ queryKey: ['business-subscription', business.id] })
      }
    } catch (err) {
      console.error('Erro ao cancelar assinatura:', err)
    } finally {
      setIsCanceling(false)
    }
  }, [subscription, business?.id, queryClient])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  // Cancelled plan
  if (isCancelled && subscription) {
    const createdAt: Date = subscription.created_at ? new Date(subscription.created_at) : new Date()
    const endDate: Date = new Date(createdAt)
    endDate.setMonth(endDate.getMonth() + 1)

    const formatDate = (date: Date): string =>
      date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

    return (
      <div className="flex flex-col gap-6">
        <div className="bg-neutral-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-neutral-700 mb-4">Plano encerrado</h3>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Última cobrança</span>
              <span className="text-neutral-600">{formatDate(createdAt)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Plano ativo até</span>
              <span className="text-neutral-600">{formatDate(endDate)}</span>
            </div>
          </div>
        </div>

        <Button
          variant="primary"
          onClick={() => router.push('/store/payment')}
        >
          Reativar plano
        </Button>

        <Button
          variant="primary"
          onClick={() => router.push('/store')}
        >
          Acessar página inicial
        </Button>
      </div>
    )
  }

  // Active plan
  if (isActive && subscription) {
    const createdAt: Date = subscription.created_at ? new Date(subscription.created_at) : new Date()
    const nextBilling: Date = new Date(createdAt)
    nextBilling.setMonth(nextBilling.getMonth() + 1)

    const formatDate = (date: Date): string =>
      date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })

    return (
      <div className="flex flex-col gap-6">
        <div className="bg-neutral-200 rounded-xl p-5">
          <h3 className="text-sm font-bold text-neutral-700 mb-4">Plano ativo</h3>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Valor</span>
              <span className="text-neutral-600">R$ 27,90/mês</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Cartão</span>
              <span className="text-neutral-600">Visa / Final ****</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Próxima cobrança</span>
              <span className="text-neutral-600">{formatDate(nextBilling)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            variant="link"
            onClick={handleCancelSubscription}
            loading={isCanceling}
            className="text-primary-600 font-bold"
          >
            Cancelar plano
          </Button>
          <Button
            variant="link"
            className="text-primary-600 font-bold"
          >
            Trocar cartão
          </Button>
        </div>

        <Button
          variant="primary"
          onClick={() => router.push('/store')}
        >
          Acessar página inicial
        </Button>
      </div>
    )
  }

  // Trial (no subscription) — Pricing card
  return (
    <div className="flex flex-col gap-8">
      <div className="text-left">
        <h2 className="text-xl font-bold text-primary-600 leading-tight pr-8">
          Continue enviando selos e fidelizando seus clientes
        </h2>
      </div>

      <div className="bg-primary-600 rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="flex items-baseline mb-6 space-x-1 relative z-10">
          <span className="text-2xl text-neutral-100 font-medium tracking-tight">R$</span>
          <span className="text-5xl font-bold text-white tracking-tighter">27,90</span>
          <span className="text-lg text-neutral-100/80 ml-1">/mês</span>
        </div>

        <ul className="space-y-4 relative z-10">
          {[
            'Selos <b>ilimitados</b>',
            'Sem taxas por envio',
            'Cancelamento a qualquer momento',
            'Pagamento mensal no cartão',
          ].map((feature, i) => (
            <li key={i} className="flex items-center space-x-3 text-neutral-100">
              <Check className="w-5 h-5 text-primary-250 flex-shrink-0" strokeWidth={2} />
              <span
                className="text-[15px] font-medium"
                dangerouslySetInnerHTML={{ __html: feature }}
              />
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-col gap-4">
        <p className="text-[15px] text-neutral-600 font-medium">
          Ative o plano do Eloop e continue enviando selos para seus clientes sem limites.
        </p>

        <div className="flex flex-col gap-3 pt-2">
          <Button
            variant="primary"
            onClick={() => router.push('/store/payment')}
            className="w-full text-base"
          >
            Continuar para pagamento
          </Button>

          <Button
            variant="link"
            onClick={() => router.push('/store')}
            className="text-primary-600 font-bold"
          >
            Sair
          </Button>
        </div>
      </div>
    </div>
  )
}
