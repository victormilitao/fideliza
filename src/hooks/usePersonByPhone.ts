import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'

export const usePersonByPhone = (phone: string) => {
  const {
    data: person,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['person', phone],
    queryFn: async () => {
      const { data } = await api.getPersonByPhone(phone)
      if (!data?.id) throw new Error('Pessoa não encontrada!')
      return data
    },
    enabled: !!phone,
    staleTime: 1000 * 60 * 60 * 4,
  })

  return { person, isLoading, isError, error, refetch }
}
