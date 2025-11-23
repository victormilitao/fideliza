import supabaseApi from './providers/supabase/supabase'
import { 
  sendEmailConfirmation, 
  sendTestEmail,
  sendEmail as emailjsSendEmail 
} from './email/emailjs'
import { ApiFunctions } from './types/api-functions.type'

// API combinada que usa Supabase + EmailJS
const emailService: ApiFunctions = {
  ...supabaseApi,
  
  // Sobrescreve a função sendEmail para usar EmailJS
  sendEmail: async (to: string, html: string) => {
    return emailjsSendEmail({
      to_email: to,
      subject: 'Notificação - Eloop',
      message: html,
      html_content: html
    })
  },

  // Novas funções de email específicas
  sendEmailConfirmation,
  sendTestEmail,
}

export default emailService
