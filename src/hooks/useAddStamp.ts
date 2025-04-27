import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/useToast'
import api from '@/services/api'
import { Stamp } from '@/types/stamp.type'
import { useMyBusiness } from './useMyBusiness'
import { useMyActiveCampaigns } from './useMyActiveCampaigns'

type Props = {
  stamp?: Partial<Stamp>
  phone?: string
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
    mutationFn: async (props: Props) => {
      if (!campaigns?.length || campaigns.length === 0) {
        throw new Error('Nenhuma campanha ativa.')
      }
      if (!props?.stamp?.userId && !props.phone) {
        throw new Error('Add stamp - params missing')
      }

      let stamp = { ...props.stamp, campaignId: campaigns[0].id }
      let personExists, newUser
      if (!stamp?.userId && props.phone) {
        personExists = await api.getUserByPhone(props.phone)

        if (!personExists?.data) {
          newUser = await api.signUp(props.phone)
        }
        stamp.userId = newUser?.data?.id || personExists?.data?.user_id
      }

      if (!stamp?.userId) throw new Error('Add stamp - No user id')

      await api.addStamp(stamp)
      return stamp
    },
    onSuccess: (updatedStamp) => {
      const { userId } = updatedStamp
      navigate('/estabelecimento/tickets', { state: { params: userId } })
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
