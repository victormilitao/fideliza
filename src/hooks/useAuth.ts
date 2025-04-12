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

  const { mutate: login, isPending: loading } = useMutation<
    Response<SignInWithPasswordResponse>,
    Error,
    Credentials
  >({
    mutationFn: async (
      credentials: Credentials
    ): Promise<Response<SignInWithPasswordResponse>> => {
      const { data, error } = await api.signInWithPassword(credentials)
      if (error) throw new Error('E-mail ou senha incorretos.')

      return { data, error }
    },
    onSuccess: (data) => {
      if (data?.data) setSession(data.data)
      navigate('/')
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

  return { login, loading }
}
