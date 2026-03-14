import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/useToast'
import api from '@/services/api'
import { Response } from '@/services/types/api.type'

export const useForgotPassword = () => {
  const toast = useToast()
  const router = useRouter()

  const { mutate: sendResetEmail, isPending: loading } = useMutation<
    Response<boolean>,
    Error,
    string
  >({
    mutationFn: async (email: string): Promise<Response<boolean>> => {
      const { data, error } = await api.resetPassword(email)
      // Não lançamos erro aqui para sempre prosseguir para a tela de envio com sucesso,
      // pois a mesma já instrui o usuário a verificar o e-mail, e também evita
      // mostrar mensagens de erro (toast) indesejadas na UI original.
      if (error) {
        console.error('Password reset request error:', error)
      }
      return { data, error }
    },
    onSuccess: () => {
      router.push('/forgot-password/sent')
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Ocorreu um erro inesperado. Tente novamente.')
      }
    },
  })

  return { sendResetEmail, loading }
}
