import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/useToast'
import api from '@/services/api'
import { Credentials } from '@/services/types/api.type'

export const useAuth = () => {
  const toast = useToast()
  const navigate = useNavigate()

  const { mutate: login, isPending: loading } = useMutation<any, Error, Credentials>({
    mutationFn: async (credentials: Credentials) => {
      const { data, error } = await api.signInWithPassword(credentials)
      if (error) {
        throw new Error('E-mail ou senha incorretos.')
      }
      return data
    },
    onSuccess: (data) => {
      console.log('User signed in:', data)
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
