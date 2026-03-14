import api from '@/services/api'
import { Response } from '@/services/types/api.type'
import { BUSINESS_OWNER } from '@/types/profile'
import { User } from '@/types/user.type'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEmailToken } from './business/useEmailToken'
import { useRouter } from 'next/navigation'
import { Business } from '@/types/business.type'
import { useToast } from './useToast'
import errorCode from '@/services/errorCode'


type CreateUser = {
  email: string
  password: string
}

type SetCnpjError = (name: 'cnpj', error: { type: string; message: string }) => void

type UseBusinessOptions = {
  setError?: SetCnpjError
}

const CNPJ_ALREADY_EXISTS_MESSAGE = 'CNPJ já cadastrado'

export const useBusiness = (options: UseBusinessOptions = {}) => {
  const { setError } = options
  const { generateEmailConfirmationToken } = useEmailToken()
  const { error: toastError } = useToast()
  const router = useRouter()
  const queryClient = useQueryClient()

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
        checkUserAlreadyExists(signUpError)
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
      router.push(`/store/email-sent/${data.data?.email}`)
    },
    onError: (error: Error) => {
      console.error('Erro ao criar usuário:', error)
    },
  })

  const {
    mutate: createBusiness,
    isPending: createBusinessloading,
  } = useMutation<Response<Business>, Error, Business>({
    mutationFn: async (business: Business) => {
      const { data: newBusiness, error } = await api.createBusiness(business)

      if (error) throw error

      return { data: newBusiness, error: null }
    },
    onSuccess: () => {
      // Invalidar a query do business para forçar uma nova busca
      queryClient.invalidateQueries({ queryKey: ['my-business'] })
      router.push('/store/create-campaign')
    },
    onError: (error: Error) => {
      const isCnpjDuplicate = error.message === 'Estabelecimento já criado.'

      if (isCnpjDuplicate && setError) {
        setError('cnpj', {
          type: 'manual',
          message: CNPJ_ALREADY_EXISTS_MESSAGE,
        })
      } else if (error.message) {
        toastError(error.message)
      }
    },
  })

  const checkUserAlreadyExists = (error: Error | null) => {
    if (error?.message === errorCode.user_already_exists) {
      const message = 'Usuário já existente'
      toastError(message)
      throw new Error(message)
    }
    return false
  }

  return { createUser, loading, createBusiness, createBusinessloading }
}
