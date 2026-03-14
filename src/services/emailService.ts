import { Response } from './types/api.type'

// Client-side email service that calls the Next.js API route
const emailService = {
  sendEmail: async (to: string, html: string): Promise<Response<boolean>> => {
    try {
      const res = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to,
          subject: 'Notificação - Eloop',
          html,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erro ao enviar email')
      }

      return { data: true, error: null }
    } catch (error) {
      console.error('Error sending email:', error)
      return { data: null, error: error as Error }
    }
  },

  sendEmailConfirmation: async (
    to: string,
    confirmationLink: string
  ): Promise<Response<boolean>> => {
    try {
      const html: string = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f9f9f9;">
          <div style="background-color: #021c54; padding: 24px 32px;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">Eloop</h1>
          </div>
          <div style="padding: 32px; background-color: #ffffff;">
            <h2 style="color: #021c54; margin: 0 0 16px 0; font-size: 20px;">Confirmação de e-mail</h2>
            <p style="color: #161616; font-size: 15px; line-height: 1.6;">
              Clique no botão abaixo para confirmar seu e-mail:
            </p>
            <a href="${confirmationLink}" 
               style="display: inline-block; background-color: #021c54; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 6px; margin-top: 20px; font-size: 15px; font-weight: 600;">
              Confirmar e-mail
            </a>
            <p style="margin-top: 28px; color: #a7a7a7; font-size: 13px; line-height: 1.5;">
              Se você não solicitou esta confirmação, ignore este e-mail.
            </p>
          </div>
          <div style="padding: 16px 32px; text-align: center; background-color: #f9f9f9;">
            <p style="color: #a7a7a7; font-size: 12px; margin: 0;">
              © Eloop — Programa de fidelidade digital
            </p>
          </div>
        </div>
      `

      const res = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to,
          subject: 'Confirmação de e-mail - Eloop',
          html,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erro ao enviar email de confirmação')
      }

      return { data: true, error: null }
    } catch (error) {
      console.error('Error sending confirmation email:', error)
      return { data: null, error: error as Error }
    }
  },

  sendTestEmail: async (to: string): Promise<Response<boolean>> => {
    try {
      const html: string = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0; background-color: #f9f9f9;">
          <div style="background-color: #021c54; padding: 24px 32px;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: bold;">Eloop</h1>
          </div>
          <div style="padding: 32px; background-color: #ffffff;">
            <h2 style="color: #021c54; margin: 0 0 16px 0; font-size: 20px;">Email de Teste</h2>
            <p style="color: #161616; font-size: 15px; line-height: 1.6;">
              Este é um email de teste para verificar se o envio está funcionando corretamente.
            </p>
            <p style="margin-top: 20px; color: #a7a7a7; font-size: 13px;">
              Enviado via Nodemailer + Gmail
            </p>
          </div>
          <div style="padding: 16px 32px; text-align: center; background-color: #f9f9f9;">
            <p style="color: #a7a7a7; font-size: 12px; margin: 0;">
              © Eloop — Programa de fidelidade digital
            </p>
          </div>
        </div>
      `

      const res = await fetch('/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to,
          subject: 'Teste - Eloop',
          html,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Erro ao enviar email de teste')
      }

      return { data: true, error: null }
    } catch (error) {
      console.error('Error sending test email:', error)
      return { data: null, error: error as Error }
    }
  },
}

export default emailService
