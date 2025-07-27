import api from '@/services/api'
import { useQuery } from '@tanstack/react-query'

export const useUserAttributes = () => {
  const getUserAttributes = async (userId: string) => {
    if (!userId) throw Error('getUserAttributes - userId is required!')
    return useQuery({
      queryKey: ['user-attributes', userId],
      queryFn: async () => {
        if (!userId) throw Error('useUser - userId is required!')
        const { data, error } = await api.getUserAttributes(userId)
        if (error) throw new Error(error.message)
        return data
      },
    })
  }

  return {
    getUserAttributes,
  }
}
