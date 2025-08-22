import emailjs from '@emailjs/browser'
import { Response } from '@/services/types/api.type'

// Configurações do EmailJS
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

export type EmailData = {
  to_email: string
  to_name?: string
  subject: string
  message: string
  html_content?: string
  confirmation_link?: string
  business_name?: string
  stamp_count?: string
  total_required?: string
  reward_code?: string
  prize?: string
  title?: string
  name?: string
  email?: string
}

export const sendEmail = async (emailData: EmailData): Promise<Response<boolean>> => {
  try {
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      throw new Error('EmailJS configuration is missing')
    }

    const templateParams = {
      to_email: emailData.to_email,
      to_name: emailData.to_name || emailData.to_email,
      subject: emailData.subject,
      message: emailData.message,
      confirmation_link: emailData.confirmation_link,
      title: emailData.title,
      name: emailData.name,
      email: emailData.email,
    }

    const result = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams,
      EMAILJS_PUBLIC_KEY
    )

    if (result.status === 200) {
      return { data: true, error: null }
    } else {
      throw new Error('Failed to send email')
    }
  } catch (error) {
    console.error('Error sending email:', error)
    return { data: null, error: error as Error }
  }
}

// Função de teste bem simples
export const sendTestEmail = async (to: string): Promise<Response<boolean>> => {
  const emailData: EmailData = {
    to_email: to,
    subject: 'Teste EmailJS - Eloop',
    message: 'Este é um email de teste para verificar se o EmailJS está funcionando.',
    confirmation_link: 'https://eloop.com.br'
  }

  return sendEmail(emailData)
}

// Função específica para confirmação de email
export const sendEmailConfirmation = async (
  to: string,
  confirmationLink: string
): Promise<Response<boolean>> => {
  const emailData: EmailData = {
    to_email: to,
    subject: 'Confirme seu email - Eloop',
    message: `Bem-vindo ao Eloop! Confirme o email pelo link: ${confirmationLink}`,
    confirmation_link: confirmationLink
  }

  return sendEmail(emailData)
}
