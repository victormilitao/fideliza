import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/useToast'
import api from '@/services/api'
import { Stamp } from '@/types/stamp.type'
import { useMyBusiness } from './useMyBusiness'

type Props = {
  stamp: Partial<Stamp>
  phone: string
}

export const useAddStamp = () => {
  const toast = useToast()
  const navigate = useNavigate()
  const { business } = useMyBusiness()

  const { mutate: addStamp, isPending: loading } = useMutation<
    void,
    Error,
    Props
  >({
    mutationFn: async (props: Props) => {
      const stamp = { ...props.stamp, businessId: business?.id }
      if (!stamp?.userId) throw new Error('Add stamps - No user id')

      const userExists = await api.checkUserExists(stamp.userId)
      if (!userExists) await api.signUp(props.phone)

      await api.addStamp(stamp)
    },
    onSuccess: (_, params) => {
      const { userId } = params.stamp
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
