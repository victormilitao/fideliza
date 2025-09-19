import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'
import { useMyBusiness } from './useMyBusiness'
import { useMyActiveCampaigns } from './useMyActiveCampaigns'

export interface ClientStats {
  count: number
  stamps: number
  totalStamps: number
}

export const useClientStats = () => {
  const { business } = useMyBusiness()
  const { campaigns } = useMyActiveCampaigns(business?.id || '')

  return useQuery({
    queryKey: ['client-stats', business?.id, campaigns?.[0]?.id],
    queryFn: async (): Promise<ClientStats[]> => {
      if (!business?.id) throw new Error('Business não encontrado')
      if (!campaigns?.length) throw new Error('Nenhuma campanha ativa')

      const campaign = campaigns[0]
      if (!campaign?.id) throw new Error('Nenhuma campanha ativa')
      const totalStampsRequired = campaign.stamps_required || 5

      // Buscar todos os cards da campanha com seus stamps
      const { data: cards } = await api.getCampaignCards(campaign.id)

      if (!cards) return []

      // Agrupar clientes por quantidade de selos
      const clientStats = new Map<number, Set<string>>()

      // Inicializar sets para cada progresso
      for (let i = 1; i <= totalStampsRequired; i++) {
        clientStats.set(i, new Set())
      }

      // Agrupar clientes por progresso de selos
      cards.forEach((card) => {
        const personId = card.person_id || card.personId
        const stampCount = card.stamps?.length || 0

        if (personId && stampCount > 0 && stampCount <= totalStampsRequired) {
          const clientSet = clientStats.get(stampCount)
          if (clientSet) {
            clientSet.add(personId)
          }
        }
      })

      // Converter para array de estatísticas
      return Array.from(clientStats.entries()).map(
        ([stampCount, clientSet]) => ({
          count: clientSet.size,
          stamps: stampCount,
          totalStamps: totalStampsRequired,
        })
      )
    },
    staleTime: 60 * 60 * 1000,
  })
}
