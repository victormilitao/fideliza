import { useUserByPhone } from './useUserByPhone'
import { useAddStamp } from './useAddStamp'
import { useToast } from './useToast'
import { useCallback } from 'react'

export const useSendStampByPhone = () => {
  const { success, error } = useToast()
  const { addStamp } = useAddStamp()
  const { getUserByPhone, isError } = useUserByPhone()

  const sendStamp = useCallback(
    async (phone: string) => {
      const sanitizedPhone = phone.replace(/\D/g, '')
      const response = await getUserByPhone(sanitizedPhone)

      if (isError || !response.data) {
        console.error('Erro ou usuário não encontrado:', {
          isError,
          response,
        })
        error('Usuário não encontrado.')
        return
      }

      await addStamp({ userId: response.data?.user_id })
      success('Selo enviado.')
    },
    [addStamp, error, success, getUserByPhone]
  )

  return { sendStamp }
}
