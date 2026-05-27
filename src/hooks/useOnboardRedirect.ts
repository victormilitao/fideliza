import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useMyBusiness } from './useMyBusiness'
import { useMyActiveCampaigns } from './useMyActiveCampaigns'
import { useBusinessSubscription } from './useBusinessSubscription'

/**
 * Hook que gerencia todos os redirecionamentos do fluxo de criação
 * - Redireciona para criar estabelecimento se não existe business
 * - Redireciona para pagamento se plano está cancelado (inativo)
 * - Redireciona para criar campanha se business existe mas não tem campanhas
 * 
 * @param shouldRedirect - Se deve fazer os redirecionamentos (padrão: true)
 * @returns Dados do business e campanhas
 */
export const useOnboardRedirect = (shouldRedirect: boolean = true) => {
  const router = useRouter()
  const pathname = usePathname()
  const { business, isLoading: businessLoading } = useMyBusiness()
  const { campaigns, isLoading: myCampaignsLoading } = useMyActiveCampaigns(
    business?.id || ''
  )
  const { subscription, isLoading: subscriptionLoading } = useBusinessSubscription(business?.id)

  // Redirecionar para criar estabelecimento se não existe business
  // Mas só se não estiver já na página de criar estabelecimento
  useEffect(() => {
    if (shouldRedirect && !businessLoading && !business) {
      const isOnCreateBusinessPage = pathname === '/store/create-store'
      if (!isOnCreateBusinessPage) {
        router.push('/store/create-store')
      }
    }
  }, [shouldRedirect, businessLoading, business, router, pathname])

  // Redirecionar para pagamento se plano está cancelado (inativo)
  useEffect(() => {
    if (
      shouldRedirect &&
      !subscriptionLoading &&
      business &&
      subscription?.subscription_status === 'canceled'
    ) {
      const isOnPaymentPage = pathname?.startsWith('/store/payment')
      const isOnSettingsPage = pathname?.startsWith('/store/settings')
      if (!isOnPaymentPage && !isOnSettingsPage) {
        router.push('/store/payment')
      }
    }
  }, [shouldRedirect, subscriptionLoading, subscription, business, router, pathname])

  // Redirecionar para criar campanha se business existe mas não tem campanhas (e plano não cancelado)
  useEffect(() => {
    if (
      shouldRedirect &&
      !myCampaignsLoading &&
      !subscriptionLoading &&
      business &&
      (!campaigns || campaigns.length === 0) &&
      subscription?.subscription_status !== 'canceled'
    ) {
      const isOnCreateCampaignPage = pathname === '/store/create-campaign'
      if (!isOnCreateCampaignPage) {
        router.push('/store/create-campaign')
      }
    }
  }, [shouldRedirect, myCampaignsLoading, subscriptionLoading, subscription, campaigns, business, router, pathname])

  // Redirecionar para home se business e campanhas já existem E plano não está cancelado
  useEffect(() => {
    if (
      shouldRedirect &&
      !myCampaignsLoading &&
      !subscriptionLoading &&
      business &&
      campaigns &&
      campaigns.length > 0 &&
      subscription?.subscription_status !== 'canceled'
    ) {
      const isOnHomePage = pathname === '/'
      if (!isOnHomePage) {
        router.push('/')
      }
    }
  }, [shouldRedirect, myCampaignsLoading, subscriptionLoading, subscription, business, campaigns, router, pathname])

  return {
    business,
    businessLoading,
    campaigns,
    myCampaignsLoading,
    subscription,
    subscriptionLoading,
    isLoading: businessLoading || myCampaignsLoading || subscriptionLoading,
  }
}
