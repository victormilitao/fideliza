import api from '@/services/api'
import { useToast } from './useToast'
import { useCallback } from 'react'

export const useReward = () => {
  const { success, error: toastError } = useToast()

  const reward = useCallback(
    async (cardId: string, code: string) => {
      try {
        const { data, error } = await api.reward(cardId, code)
        if (error || !data) {
          toastError('O código informado está incorreto.')
          return
        }

        success('Premiação realizada.')
      } catch (err) {
        console.error('add stamp error:', err)
      }
    },
    [success, toastError]
  )

  return { reward }
}
