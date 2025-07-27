import { Response } from '@/services/types/api.type'
import supabase from '../../config'
import api from '@/services/api'
import { generateUuid } from '@/utils/uuid'

export const generateEmailConfirmationToken = async (
  userId: string
): Promise<Response<string>> => {
  try {
    if (!userId) throw new Error('User ID is required')

    const { data: emailToken, error: emailTokenError } = await supabase
      .from('email_confirmation_tokens')
      .upsert(
        {
          user_id: userId,
          expires_at: new Date(Date.now() + 60 * 60 * 1000),
          token: generateUuid(),
        },
        { onConflict: 'user_id' }
      )
      .select()
      .maybeSingle()
    console.dir(emailToken)

    if (emailTokenError || !emailToken)
      throw new Error('Failed to generate email confirmation token')

    if (emailTokenError || !emailToken) {
      console.error('Erro no emailToken:', emailTokenError)
      return { data: null, error: emailTokenError }
    }

    const { data } = await api.getUserAttributes(userId)
    if (!data?.email) {
      console.error('Erro ao obter atributos do usuário.')
      return {
        data: null,
        error: new Error('Erro ao obter atributos do usuário.'),
      }
    }

    const link = `${window.location.origin}/estabelecimento/confirm-email/${emailToken.token}`
    const { error } = await api.sendEmail(
      data?.email,
      `<p>Bem-vindo ao Eloop! Confirme o email pelo link: ${link}</p>`
    )

    if (error) {
      console.error('Erro ao enviar email:', error)
      return { data: null, error }
    }

    return { data: data?.email, error: null }
  } catch (err) {
    console.error('generateEmailConfirmationToken - Unexpected error:', err)
    return { data: null, error: err as Error }
  }
}
