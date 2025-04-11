import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/useToast'
import api from '@/services/api'
import { Stamp } from '@/types/stamp.type'

export const useAddStamp = () => {
  const toast = useToast()
  const navigate = useNavigate()

  const { mutate: addStamp, isPending: loading } = useMutation<
    void,
    Error,
    Stamp
  >({
    mutationFn: async (stamp: Stamp) => {
      await api.addStamp(stamp)
    },
    onSuccess: (data) => {
      console.dir(data)
      toast.success('Selo enviado com sucesso!')
      navigate('/estabelecimento/tickets')
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
