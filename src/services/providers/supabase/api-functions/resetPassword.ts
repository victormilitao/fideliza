import { Response } from '@/services/types/api.type'

export const resetPassword = async (
  email: string
): Promise<Response<boolean>> => {
  try {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return { data: false, error: new Error(errorData.error || 'Erro ao enviar e-mail') }
    }

    return { data: true, error: null }
  } catch (err) {
    console.error('Unexpected error:', err)
    return { data: false, error: new Error('Erro inesperado. Tente novamente.') }
  }
}
