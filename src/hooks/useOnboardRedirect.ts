import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
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
  const { business, isLoading: businessLoading } = useMyBusiness()
  const { campaigns, isLoading: myCampaignsLoading } = useMyActiveCampaigns(
    business?.id || ''
  )

  // Redirecionar para criar estabelecimento se não existe business
  useEffect(() => {
    if (shouldRedirect && !businessLoading && !business) {
      navigate('/estabelecimento/criar-estabelecimento')
    }
  }, [shouldRedirect, businessLoading, business, navigate])

  // Redirecionar para criar campanha se business existe mas não tem campanhas
  useEffect(() => {
    if (shouldRedirect && !myCampaignsLoading && business && (!campaigns || campaigns.length === 0)) {
      // navigate('/estabelecimento/criar-campanha')
    }
  }, [shouldRedirect, myCampaignsLoading, campaigns, business, navigate])

  // Redirecionar para home se business e campanhas já existem
  useEffect(() => {
    if (shouldRedirect && !myCampaignsLoading && business && campaigns && campaigns.length > 0) {
      navigate('/estabelecimento')
    }
  }, [shouldRedirect, myCampaignsLoading, business, campaigns, navigate])

  return {
    business,
    businessLoading,
    campaigns,
    myCampaignsLoading
  }
}
