import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useMyBusiness } from './useMyBusiness'
import { useMyActiveCampaigns } from './useMyActiveCampaigns'

/**
 * Hook que gerencia todos os redirecionamentos do fluxo de criação
 * - Redireciona para criar estabelecimento se não existe business
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

  // Redirecionar para criar campanha se business existe mas não tem campanhas
  useEffect(() => {
    if (shouldRedirect && !myCampaignsLoading && business && (!campaigns || campaigns.length === 0)) {
      const isOnCreateCampaignPage = pathname === '/store/create-campaign'
      if (!isOnCreateCampaignPage) {
        router.push('/store/create-campaign')
      }
    }
  }, [shouldRedirect, myCampaignsLoading, campaigns, business, router, pathname])

  // Redirecionar para home se business e campanhas já existem
  useEffect(() => {
    if (shouldRedirect && !myCampaignsLoading && business && campaigns && campaigns.length > 0) {
      const isOnHomePage = pathname === '/'
      if (!isOnHomePage) {
        router.push('/')
      }
    }
  }, [shouldRedirect, myCampaignsLoading, business, campaigns, router, pathname])

  return {
    business,
    businessLoading,
    campaigns,
    myCampaignsLoading,
    isLoading: businessLoading || myCampaignsLoading,
  }
}
