import { useAddStamp } from './useAddStamp'
import { useToast } from './useToast'
import { useCallback } from 'react'

export const useSendStampByPhone = () => {
  const { success, error } = useToast()
  const { addStamp } = useAddStamp()

  const sendStamp = useCallback(
    async (phone: string) => {
      const sanitizedPhone = phone.replace(/\D/g, '')

      try {
        await addStamp({ phone: sanitizedPhone })
        success('Selo enviado.')
      } catch (err) {
        console.error('add stamp error:', err)
      }
    },
    [addStamp, error, success]
  )

  return { sendStamp }
}
