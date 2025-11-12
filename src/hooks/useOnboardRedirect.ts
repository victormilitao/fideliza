import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
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
  const navigate = useNavigate()
  const location = useLocation()
  const { business, isLoading: businessLoading } = useMyBusiness()
  const { campaigns, isLoading: myCampaignsLoading } = useMyActiveCampaigns(
    business?.id || ''
  )

  // Redirecionar para criar estabelecimento se não existe business
  // Mas só se não estiver já na página de criar estabelecimento
  useEffect(() => {
    if (shouldRedirect && !businessLoading && !business) {
      const isOnCreateBusinessPage = location.pathname === '/estabelecimento/criar-estabelecimento'
      if (!isOnCreateBusinessPage) {
        navigate('/estabelecimento/criar-estabelecimento')
      }
    }
  }, [shouldRedirect, businessLoading, business, navigate, location.pathname])

  // Redirecionar para criar campanha se business existe mas não tem campanhas
  useEffect(() => {
    if (shouldRedirect && !myCampaignsLoading && business && (!campaigns || campaigns.length === 0)) {
      const isOnCreateCampaignPage = location.pathname === '/estabelecimento/criar-campanha'
      if (!isOnCreateCampaignPage) {
        navigate('/estabelecimento/criar-campanha')
      }
    }
  }, [shouldRedirect, myCampaignsLoading, campaigns, business, navigate, location.pathname])

  // Redirecionar para home se business e campanhas já existem
  useEffect(() => {
    if (shouldRedirect && !myCampaignsLoading && business && campaigns && campaigns.length > 0) {
      const isOnHomePage = location.pathname === '/estabelecimento'
      if (!isOnHomePage) {
        navigate('/estabelecimento')
      }
    }
  }, [shouldRedirect, myCampaignsLoading, business, campaigns, navigate, location.pathname])

  return {
    business,
    businessLoading,
    campaigns,
    myCampaignsLoading
  }
}
