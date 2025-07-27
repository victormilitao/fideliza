import api from '@/services/api'
import { Response } from '@/services/types/api.type'
import { BUSINESS_OWNER } from '@/types/profile'
import { User } from '@/types/user.type'
import { useMutation } from '@tanstack/react-query'
import { useEmailToken } from './business/useEmailToken'
import { useNavigate } from 'react-router-dom'

type CreateUser = {
  email: string
  password: string
}

export const useBusiness = () => {
  const { generateEmailConfirmationToken } = useEmailToken()
  const navigate = useNavigate()

  const { mutate: createUser, isPending: loading } = useMutation<
    Response<User>,
    Error,
    CreateUser
  >({
    mutationFn: async (credentials: CreateUser) => {
      const { data: user, error: signUpError } = await api.signUp(
        '',
        credentials.email,
        credentials.password
      )
      if (signUpError || !user?.id) {
        console.error('Erro no signUp:', signUpError)
        return { data: null, error: signUpError }
      }

      const { data: profile, error: profileError } = await api.createProfile(
        user?.id,
        null,
        BUSINESS_OWNER
      )

      if (profileError || !profile) {
        console.error('Erro no createProfile:', profileError)
        return { data: null, error: profileError }
      }

      await generateEmailConfirmationToken({ userId: user?.id })

      return { data: user, error: null }
    },
    onSuccess: (data) => {
      console.dir('Enviando email!')
      console.dir(data.data?.email)
      navigate(`/estabelecimento/email-sent/${data.data?.email}`)
    },
    onError: (error: Error) => {
      console.error('Erro ao criar usuário:', error)
    }
  })

  return { createUser, loading }
}
