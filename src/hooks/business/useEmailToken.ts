import api from '@/services/api'
import { Response } from '@/services/types/api.type'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../useToast'

export const useEmailToken = () => {
  const navigate = useNavigate()
  const { error: toastError, success } = useToast()

  const { mutate: verifyToken } = useMutation<
    Response<boolean>,
    Error,
    { token: string }
  >({
    mutationFn: async ({ token }) => {
      if (!token) throw new Error('Token is required')

      const { data, error } = await api.confirmEmail(token)

      if (data === null || !data?.userId) throw new Error('Token inválido!')
      if (!data.tokenValid) {
        toastError(
          'Link de confirmação expirado. Insira as informações acima novamente.'
        )
        const { data: email } = await generateEmailConfirmationToken({
          userId: data.userId,
        })
        navigate(`/estabelecimento/email-sent/${email}`)
        return { data: false, error }
      }

      return { data: true, error: null }
    },
    onSuccess: (data) => onSuccess(data),
    onError: (err) => {
      toastError(err.message || 'Erro ao confirmar o e-mail.')
      navigate('/login')
    },
  })

  const onSuccess = (data: Response<boolean>) => {
    if (data.data) {
      success('Email confirmado! Você já pode acessar o Eloop.')
      navigate('/login')
    }
  }

  const { mutateAsync: generateEmailConfirmationToken } = useMutation<
    Response<string>,
    Error,
    { userId: string }
  >({
    mutationFn: async ({ userId }) => {
      const { data: email, error: emailError } =
        await api.generateEmailConfirmationToken(userId)

      if (emailError || !email) {
        console.error('Erro no emailToken:', emailError)
        return { data: null, error: emailError }
      }

      return { data: email, error: null }
    },
  })

  return { verifyToken, generateEmailConfirmationToken }
}
