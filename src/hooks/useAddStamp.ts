import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/hooks/useToast'
import api from '@/services/api'
import { Stamp } from '@/types/stamp.type'
import { useMyBusiness } from './useMyBusiness'
import { useMyActiveCampaigns } from './useMyActiveCampaigns'
import { useTrialStatus } from './useTrialStatus'

type Props = {
  personId: string
}

export const useAddStamp = () => {
  const toast = useToast()
  const { business } = useMyBusiness()
  const { campaigns } = useMyActiveCampaigns(business?.id || '')
  const { trialStatus } = useTrialStatus()
  const queryClient = useQueryClient()

  const { mutateAsync: addStamp, isPending: loading } = useMutation<
    Stamp,
    Error,
    Props
  >({
    mutationFn: async ({ personId }: Props): Promise<Stamp> => {
      if (!business) {
        throw new Error('Estabelecimento não encontrado. Tente novamente.')
      }

      if (!campaigns || campaigns.length === 0) {
        throw new Error('Nenhuma campanha ativa.')
      }

      if (trialStatus === 'blocked') {
        throw new Error(
          'Você atingiu o limite do teste gratuito. Assine para continuar enviando selos.'
        )
      }

      const campaignId = campaigns[0].id || ''
      const response = await api.addStamp(personId, campaignId)

      if (!response || !response.data) {
        throw new Error('Erro ao adicionar selo.')
      }

      return response.data
    },
    onSuccess: () => {
      // Invalidar cache dos trial stamps para atualizar contagem
      queryClient.invalidateQueries({ queryKey: ['trial-stamps'] })
    },
    onError: (error: unknown) => {
      console.error('Error:', error)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Ocorreu um erro inesperado. Tente novamente.')
      }
    },
  })

  return { addStamp, loading }
}

