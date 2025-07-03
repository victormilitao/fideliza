import { useCallback } from 'react'
import api from '@/services/api'
import { useToast } from '@/hooks/useToast'
import { useMyBusiness } from './useMyBusiness'
import { useMyActiveCampaigns } from './useMyActiveCampaigns'

export const useCompletedCard = () => {
  const { error: toastError } = useToast()
  const { business } = useMyBusiness()
  const { campaigns } = useMyActiveCampaigns(business?.id || '')

  const findCompletedCard = useCallback(
    async (phoneParam: string) => {
      try {
        if (!campaigns || campaigns?.length === 0) {
          throw new Error('Nenhuma campanha ativa.')
        }

        const sanitizedPhone = phoneParam.replace(/\D/g, '')
        const { data: person, error: personError } = await api.getPersonByPhone(
          sanitizedPhone
        )
        if (personError || !person)
          throw new Error(personError?.message || 'Pessoa não encontrada!')

        const { data, error } = await api.findCompletedCard(
          person?.id || '',
          campaigns.map((c) => c.id).filter(Boolean) as string[]
        )
        if (error || !data)
          throw new Error(error?.message || 'Cartão premiado não encontrado!')

        return data
      } catch (err) {
        if (err instanceof Error) {
          toastError(err.message)
        } else {
          toastError('Erro inesperado ao buscar o cartão premiado.')
        }
        console.error('useCompletedCard:', err)
        return null
      }
    },
    [toastError]
  )

  return {
    findCompletedCard,
  }
}
