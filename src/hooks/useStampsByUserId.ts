import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'

export const useStampsByUserId = (userId?: string) => {
  return useQuery({
    queryKey: ['stamps-by-user-id', userId],
    queryFn: async () => {
      if (!userId) throw new Error('UserId inválido')
      const { data } = await api.getStampsByUserId(userId)
      return data
    },
    enabled: !!userId,
  })
}
