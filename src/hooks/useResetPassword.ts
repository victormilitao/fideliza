import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/useToast'
import api from '@/services/api'
import { Response } from '@/services/types/api.type'

export const useResetPassword = () => {
  const toast = useToast()
  const router = useRouter()

  const { mutate: updatePassword, isPending: loading } = useMutation<
    Response<boolean>,
    Error,
    string
  >({
    mutationFn: async (password: string): Promise<Response<boolean>> => {
      const { data, error } = await api.updatePassword(password)
      if (error) throw new Error('Erro ao atualizar a senha. Tente novamente.')
      return { data, error }
    },
    onSuccess: () => {
      toast.success('Senha atualizada com sucesso!')
      router.push('/login')
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Ocorreu um erro inesperado. Tente novamente.')
      }
    },
  })

  return { updatePassword, loading }
}
