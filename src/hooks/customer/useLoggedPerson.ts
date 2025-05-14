import api from '@/services/api'
import { useAuthStore } from '@/store/useAuthStore'
import { useQuery } from '@tanstack/react-query'

export const useLoggedPerson = () => {
  const { session } = useAuthStore()
  const userId = session?.user.id

  const { data: person } = useQuery({
    queryKey: ['logged-person', userId],
    queryFn: async () => {
      if (!userId) throw new Error('userId inválido')
      const { data } = await api.getPersonByUserId(userId)
      return data
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 60 * 24,
  })

  return { person }
}
