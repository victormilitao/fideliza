import api from '@/services/api'
import { useQuery } from '@tanstack/react-query'

export const useCardsByPerson = (personId?: string) => {
  return useQuery({
    queryKey: ['cards-by-person', personId],
    queryFn: async () => {
      if (!personId) throw new Error('PersonId inválido')
      const { data } = await api.getCardsByPersonId(personId)
      return data
    },
    enabled: !!personId,
    staleTime: 1000 * 60 * 60 * 24,
  })
}
