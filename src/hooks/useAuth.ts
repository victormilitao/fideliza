import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/useToast'
import api from '@/services/api'
import { Response } from '@/services/types/api.type'
import {
  Credentials,
  SignInWithPasswordResponse,
} from '@/services/types/auth.type'
import { useAuthStore } from '@/store/useAuthStore'
import { BUSINESS_OWNER, Profile } from '@/types/profile'
import { useLogout } from './useLogout'

export const useAuth = () => {
  const toast = useToast()
  const navigate = useNavigate()
  const { setSession } = useAuthStore()
  const { logout } = useLogout(false)

  const { mutate: login, isPending: loading } = useMutation<
    Response<SignInWithPasswordResponse>,
    Error,
    Credentials
  >({
    mutationFn: async (
      credentials: Credentials
    ): Promise<Response<SignInWithPasswordResponse>> => {
      const { data, error } = await api.signInWithPassword(credentials)
      if (error) throw new Error('E-mail ou senha incorretos.')

      const { data: profile } = await api.getProfile(data?.user?.id || '')
      if (profile && data) {
        data.profile = { role: profile.role, verified: profile.verified }
      }

      return { data, error }
    },
    onSuccess: (data) => {
      if (data?.data) setSession(data.data)
      verifyProfile(data.data?.profile || {}, data.data?.user?.email) &&
        navigate('/')
    },
    onError: (error: unknown) => {
      console.error('Error signing in:', error)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error('Ocorreu um erro inesperado. Tente novamente.')
      }
    },
  })

  const verifyProfile = (
    profile: Profile,
    email: string | undefined
  ): boolean => {
    if (profile?.role === BUSINESS_OWNER && !profile.verified) {
      logout()
      navigate(`/estabelecimento/email-sent/${email}`)
      return false
    }
    return true
  }

  return { login, loading }
}
