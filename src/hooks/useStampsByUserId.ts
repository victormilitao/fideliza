import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'
import { useMyBusiness } from './useMyBusiness'

export const useStampsByUserId = (userId?: string) => {
  const { business } = useMyBusiness()
  return useQuery({
    queryKey: ['stamps-by-user-id', userId],
    queryFn: async () => {
      if (!userId) throw new Error('UserId inválido')
      if (!business?.id) throw new Error('BusinessId inválido')
      const { data } = await api.getStampsByUserId(userId, business?.id)
      return data
    },
    enabled: !!userId,
  })
}
