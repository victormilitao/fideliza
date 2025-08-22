import api from '@/services/api'
import { useAddStamp } from './useAddStamp'
import { useToast } from './useToast'
import { useCallback, useState } from 'react'

export const useSendStampByPhone = () => {
  const { success, error } = useToast()
  const { addStamp } = useAddStamp()
  const [loading, setLoading] = useState<boolean>(false)

  const sendStamp = useCallback(
    async (phone: string, onSuccess?: () => void) => {
      setLoading(true)
      const sanitizedPhone = phone.replace(/\D/g, '')

      try {
        const { data: person } = await api.findOrCreatePerson(sanitizedPhone)
        if (!person?.id) {
          error('Erro ao encontrar ou criar a pessoa.')
          return
        }
        await addStamp({ personId: person.id })
        success('Selo enviado.')
        onSuccess?.()
      } catch (err) {
        console.error('add stamp error:', err)
      } finally {
        setLoading(false)
      }
    },
    [addStamp, error, success]
  )

  return { sendStamp, loading }
}
