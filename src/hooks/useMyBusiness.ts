import api from '@/services/api'
import { useQuery } from '@tanstack/react-query'

export const useMyBusiness = () => {
  const {
    data: business,
    error,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['my-business'],
    queryFn: async () => {
      const { data, error } = await api.getMyBusiness()
      if (error) throw new Error(error.message)
      return data
    },
  })

  return {
    business,
    error,
    isLoading,
    isError,
    refetch,
  }
}
