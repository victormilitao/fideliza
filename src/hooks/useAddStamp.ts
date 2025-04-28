import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/useToast'
import api from '@/services/api'
import { Stamp } from '@/types/stamp.type'
import { useMyBusiness } from './useMyBusiness'
import { useMyActiveCampaigns } from './useMyActiveCampaigns'

type Props = {
  personId: string
}

export const useAddStamp = () => {
  const toast = useToast()
  const navigate = useNavigate()
  const { business } = useMyBusiness()
  const { campaigns } = useMyActiveCampaigns(business?.id || '')

  const { mutateAsync: addStamp, isPending: loading } = useMutation<
    Stamp,
    Error,
    Props
  >({
    mutationFn: async ({ personId }: Props) => {
      if (!campaigns || campaigns.length === 0) {
        throw new Error('Nenhuma campanha ativa.')
      }

      const campaignId = campaigns[0].id || ''
      const stamp = await api.addStamp(personId, campaignId)
      return stamp
    },
    onSuccess: (updatedStamp) => {
      const { personId } = updatedStamp
      navigate('/estabelecimento/tickets', { state: { params: personId } })
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
