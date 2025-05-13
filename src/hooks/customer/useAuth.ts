import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/useToast'
import api from '@/services/api'
import { Response } from '@/services/types/api.type'
import {
  Credentials,
  SignInWithPasswordResponse,
} from '@/services/types/auth.type'
import { useAuthStore } from '@/store/useAuthStore'

export const useAuth = () => {
  const toast = useToast()
  const navigate = useNavigate()
  const { setSession } = useAuthStore()

  const { mutateAsync: checkPersonExisting, isPending: checkLoading } =
    useMutation<Response<boolean>, Error, string>({
      mutationFn: async (phone: string): Promise<Response<boolean>> => {
        const { data, error } = await api.getPersonByPhone(phone)
        if (error || !data) throw new Error('Usuário não encontrado.')
        return { data: !!data, error }
      },
      onError: (error: unknown) => {
        console.error('checkPersonExisting error:', error)
        if (error instanceof Error) {
          toast.error(error.message)
        } else {
          toast.error('Ocorreu um erro inesperado. Tente novamente.')
        }
      },
    })

  const { mutate: login, isPending: loading } = useMutation<
    Response<SignInWithPasswordResponse>,
    Error,
    Credentials
  >({
    mutationFn: async (
      credentials: Credentials
    ): Promise<Response<SignInWithPasswordResponse>> => {
      const { data: isValidCode } = await api.signInWithCode(credentials)
      if (!isValidCode) throw new Error('O código informado está incorreto.')

      const { data, error } = await api.signInWithPassword(credentials)
      if (error) throw new Error('E-mail ou senha incorretos.')

      const { data: profile } = await api.getProfile(data?.user?.id || '')
      if (profile && data) data.profile = { role: profile.role }

      return { data, error }
    },
    onSuccess: (data) => {
      if (data?.data) setSession(data.data)
      navigate('/usuario')
    },
    onError: (error: unknown) => {
      console.error('Error signing in:', error)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Ocorreu um erro inesperado. Tente novamente.')
      }
    },
  })

  return { login, loading, checkPersonExisting, checkLoading }
}
