import { useMutation } from '@tanstack/react-query'
import { useToast } from '@/hooks/useToast'
import api from '@/services/api'
import { Response } from '@/services/types/api.type'
import { Person } from '@/types/person.type'

export const useUserByPhone = () => {
  const toast = useToast()

  const {
    mutateAsync: getUserByPhone,
    isPending,
    isError,
    error,
  } = useMutation<
    Response<Person>,
    Error,
    string
  >({
    mutationFn: async (phone: string): Promise<Response<Person>> => {
      const sanitizedPhone = phone.replace(/\D/g, '')
      const { data, error } = await api.getUserByPhone(sanitizedPhone)
      if (error) throw new Error(error.message)
      return { data, error }
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error('Usuário não encontrado.')
      } else {
        toast.error('Erro ao buscar usuário. Tente novamente.')
      }
    },
  })

  return {
    isPending,
    isError,
    error,
    getUserByPhone,
  }
}
