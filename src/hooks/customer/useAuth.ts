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
import { Person } from '@/types/person.type'

type LoginParams = {
  credentials: Credentials
  person: Person | null
}

export const useAuth = () => {
  const toast = useToast()
  const navigate = useNavigate()
  const { setSession } = useAuthStore()

  const { mutateAsync: checkPersonExisting, isPending: checkLoading } =
    useMutation<Response<Person>, Error, string>({
      mutationFn: async (phone: string): Promise<Response<Person>> => {
        const { data, error } = await api.getPersonByPhone(phone)
        if (error || !data?.id) throw new Error('Usuário não encontrado.')

        const { error: codeError } = await api.generateCodeLogin(data.id)
        if (codeError) throw new Error('Erro ao gerar código.')

        return { data, error }
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
    LoginParams
  >({
    mutationFn: async ({ credentials, person }: LoginParams): Promise<Response<SignInWithPasswordResponse>> => {
      if (!person) throw new Error('Usuário não encontrado.')
        
      const { data: isValidCode } = await api.signInWithCode(credentials, person)
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
