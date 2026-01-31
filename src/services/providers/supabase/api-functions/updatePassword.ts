import supabase from '../config'
import { Response } from '@/services/types/api.type'

export const updatePassword = async (
  newPassword: string,
  token?: string
): Promise<Response<boolean>> => {
  try {
    // Se tiver token, usar Edge Function para resetar com admin API
    if (token) {
      const { data, error } = await supabase.functions.invoke('reset-password', {
        body: {
          token,
          newPassword,
        },
      })

      if (error) {
        console.error('Erro ao resetar senha via Edge Function:', error)
        return { data: false, error }
      }

      return { data: true, error: null }
    }

    // Caso contrário, usar o método padrão (requer sessão ativa)
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) {
      return { data: false, error }
    }

    return { data: true, error: null }
  } catch (err) {
    console.error('updatePassword - Unexpected error:', err)
    return { data: false, error: err as Error }
  }
}

