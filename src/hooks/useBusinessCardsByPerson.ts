import api from '@/services/api'
import { useQuery } from '@tanstack/react-query'

export const useBusinessCardsByPerson = (personId?: string) => {
  return useQuery({
    queryKey: ['cards-by-person', personId],
    queryFn: async () => {
      if (!personId) throw new Error('PersonId inválido')
      const { data } = await api.getBusinessCardsByPersonId(personId)
      return data
    },
    enabled: !!personId,
  })
}
