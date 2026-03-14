import { useMutation } from '@tanstack/react-query'
import { useToast } from '@/hooks/useToast'
import api from '@/services/api'
import { Stamp } from '@/types/stamp.type'
import { useMyBusiness } from './useMyBusiness'
import { useMyActiveCampaigns } from './useMyActiveCampaigns'
import { useBusinessSubscription } from './useBusinessSubscription'
import { useTotalStamps } from './useTotalStamps'

type Props = {
  personId: string
}

export const useAddStamp = () => {
  const toast = useToast()
  const { business } = useMyBusiness()
  const { campaigns } = useMyActiveCampaigns(business?.id || '')
  const { subscription } = useBusinessSubscription(business?.id || '')
  const { totalStamps } = useTotalStamps(business?.id || '')

  const { mutateAsync: addStamp, isPending: loading } = useMutation<
    Stamp,
    Error,
    Props
  >({
    mutationFn: async ({ personId }: Props): Promise<Stamp> => {
      if (!business) {
        throw new Error('Estabelecimento não encontrado. Tente novamente.')
      }

      const isSubscribed = subscription?.status === 'complete' || subscription?.status === 'active'
      const stampsCount = totalStamps || 0

      if (!isSubscribed && stampsCount >= 50) {
        throw new Error('LIMIT_REACHED')
      }

      if (!campaigns || campaigns.length === 0) {
        throw new Error('Nenhuma campanha ativa.')
      }

      const campaignId = campaigns[0].id || ''
      const response = await api.addStamp(personId, campaignId)

      if (!response || !response.data) {
        throw new Error('Erro ao adicionar selo.')
      }

      return response.data
    },
    onError: (error: unknown) => {
      console.error('Error:', error)
      if (error instanceof Error) {
        if (error.message !== 'LIMIT_REACHED') {
          toast.error(error.message)
        }
      } else {
        toast.error('Ocorreu um erro inesperado. Tente novamente.')
      }
    },
  })

  return { addStamp, loading }
}
