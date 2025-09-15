import { useMutation } from '@tanstack/react-query'
import { useToast } from '@/hooks/useToast'
import api from '@/services/api'
import { Campaign } from '@/types/campaign.type'
import { useNavigate } from 'react-router-dom'

type CreateCampaignData = Omit<Campaign, 'id' | 'created_at' | 'business' | 'cards' | 'card'>

export const useCampaign = () => {
  const toast = useToast()
  const navigate = useNavigate()

  const { mutateAsync: createCampaign, isPending: createCampaignLoading } = useMutation<
    Campaign,
    Error,
    CreateCampaignData
  >({
    mutationFn: async (data: CreateCampaignData): Promise<Campaign> => {
      const response = await api.createCampaign(data)

      if (!response || !response.data) {
        throw new Error('Erro ao criar campanha.')
      }

      return response.data
    },
    onSuccess: () => {
      navigate('/estabelecimento')
    },
    onError: (error: unknown) => {
      console.error('Error creating campaign:', error)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Ocorreu um erro inesperado. Tente novamente.')
      }
    },
  })

  return {
    createCampaign,
    createCampaignLoading,
  }
}
