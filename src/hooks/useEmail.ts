import { useMutation } from '@tanstack/react-query'
import emailService from '@/services/emailService'
import { useToast } from './useToast'

export const useEmail = () => {
  const { success, error: toastError } = useToast()

  // Hook para teste de email
  const { mutate: sendTestEmail, isPending: isSendingTest } = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const { data, error } = await emailService.sendTestEmail(email)
      if (error) throw error
      return data
    },
    onSuccess: () => {
      success('Email de teste enviado com sucesso!')
    },
    onError: (error) => {
      toastError('Erro ao enviar email de teste: ' + error.message)
    },
  })

  // Hook para enviar confirmação de email
  const { mutate: sendEmailConfirmation, isPending: isSendingConfirmation } = useMutation({
    mutationFn: async ({ email, link }: { email: string; link: string }) => {
      const { data, error } = await emailService.sendEmailConfirmation(email, link)
      if (error) throw error
      return data
    },
    onSuccess: () => {
      success('Email de confirmação enviado com sucesso!')
    },
    onError: (error) => {
      toastError('Erro ao enviar email de confirmação: ' + error.message)
    },
  })



  return {
    sendTestEmail,
    isSendingTest,
    sendEmailConfirmation,
    isSendingConfirmation,
  }
}
