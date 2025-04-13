import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/useToast'
import api from '@/services/api'
import { Stamp } from '@/types/stamp.type'
import { useMyBusiness } from './useMyBusiness'

export const useAddStamp = () => {
  const toast = useToast()
  const navigate = useNavigate()
  const { business } = useMyBusiness()

  const { mutate: addStamp, isPending: loading } = useMutation<
    void,
    Error,
    Partial<Stamp>
  >({
    mutationFn: async (partialStamp: Partial<Stamp>) => {
      const stamp = { ...partialStamp, businessId: business?.id }
      await api.addStamp(stamp)
    },
    onSuccess: (_, params) => {
      navigate('/estabelecimento/tickets', { state: { params } })
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
