import supabase from '../config'
import { Response } from '@/services/types/api.type'
import api from '@/services/api'
import { generateUuid } from '@/utils/uuid'

export const resetPasswordForEmail = async (
  email: string
): Promise<Response<boolean>> => {
  try {
    if (!email) throw new Error('Email é obrigatório')

    // Gerar token de reset
    const token = generateUuid()
    const expiresAt = new Date(Date.now() + 12 * 60 * 60 * 1000) // 12 horas

    // Salvar token na tabela password_reset_tokens
    const { data: tokenData, error: tokenError } = await supabase
      .from('password_reset_tokens')
      .insert({
        email: email,
        token: token,
        expires_at: expiresAt,
      })
      .select()
      .maybeSingle()

    if (tokenError || !tokenData) {
      console.error('Failed to create password reset token:', tokenError)
      return {
        data: false,
        error: new Error('Erro ao gerar token de recuperação'),
      }
    }

    // Criar o link de reset
    const resetLink = `${window.location.origin}/reset-password?token=${token}`

    // Criar HTML do email conforme o design do Figma
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Redefinição de senha - Fideliza</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #021c54;">Olá,</h2>
          <p>Recebemos uma solicitação para modificar sua senha de Fideliza.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background-color: #021c54; color: white; padding: 12px 24px; 
                      text-decoration: none; border-radius: 4px; display: inline-block;">
              Redefinir senha
            </a>
          </div>
          <p style="font-size: 12px; color: #666;">
            <strong>Importante:</strong> Link tem validade por 12 horas. Após esse período, será necessário realizar uma nova solicitação.
          </p>
          <p style="font-size: 12px; color: #666;">
            Se você não fez essa solicitação, pode ignorar este e-mail com segurança.
          </p>
          <p style="margin-top: 30px; font-size: 12px; color: #666;">
            Equipe Fideliza
          </p>
        </div>
      </body>
      </html>
    `

    // Enviar email usando a Edge Function send-email
    const { error: emailError } = await api.sendEmail(email, emailHtml)

    if (emailError) {
      console.error('Erro ao enviar email:', emailError)
      // Deletar o token se o email falhar
      await supabase.from('password_reset_tokens').delete().eq('token', token)
      return {
        data: false,
        error: new Error('Erro ao enviar email de recuperação'),
      }
    }

    return { data: true, error: null }
  } catch (err) {
    console.error('resetPasswordForEmail - Unexpected error:', err)
    return { data: false, error: err as Error }
  }
}

