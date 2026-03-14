import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/useToast'
import { Response } from '@/services/types/api.type'

export const useResetPassword = () => {
  const toast = useToast()
  const router = useRouter()

  const { mutate: updatePassword, isPending: loading } = useMutation<
    Response<boolean>,
    Error,
    { password?: string, token: string }
  >({
    mutationFn: async ({ password, token }): Promise<Response<boolean>> => {
      const resp = await fetch('/api/auth/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, token })
      })
      const data = await resp.json()

      if (!resp.ok) {
        throw new Error(data.error || 'Erro ao atualizar a senha. Tente novamente.')
      }

      return { data: true, error: null }
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
