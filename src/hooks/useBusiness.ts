import api from '@/services/api'
import { Response } from '@/services/types/api.type'
import { BUSINESS_OWNER } from '@/types/profile'
import { User } from '@/types/user.type'
import { useMutation } from '@tanstack/react-query'
import { useEmailToken } from './business/useEmailToken'
import { useNavigate } from 'react-router-dom'
import { Business } from '@/types/business.type'
import { useToast } from './useToast'

type CreateUser = {
  email: string
  password: string
}

export const useBusiness = () => {
  const { generateEmailConfirmationToken } = useEmailToken()
  const navigate = useNavigate()
  const { error: toastError, success } = useToast()

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
    },
  })

  const { mutate: createBusiness, isPending: createBusinessloading } =
    useMutation<Response<Business>, Error, Business>({
      mutationFn: async (business: Business) => {
        const { data: newBusiness, error } = await api.createBusiness(business)

        if (error) throw error

        return { data: newBusiness, error: null }
      },
      onSuccess: () => {
        success('Estabelecimento criado.')
        navigate('/estabelecimento/criar-campanha')
      },
      onError: (error: Error) => {
        console.error('createBusiness error:', error)
        error.message && toastError(error.message)
      },
    })

  return { createUser, loading, createBusiness, createBusinessloading }
}
