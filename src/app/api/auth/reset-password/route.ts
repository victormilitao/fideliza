import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import nodemailer from 'nodemailer'

type ResetPasswordRequestBody = {
  email: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ResetPasswordRequestBody = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Required field: email' },
        { status: 400 }
      )
    }

    const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
    const supabaseServiceKey: string =
      process.env.SUPABASE_SERVICE_ROLE_KEY || ''

    if (!supabaseServiceKey) {
      console.error('SUPABASE_SERVICE_ROLE_KEY not configured')
      return NextResponse.json(
        { error: 'Service not configured' },
        { status: 500 }
      )
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const origin: string =
      request.headers.get('origin') || 'http://localhost:3000'

    // 1. Search for user by email using our custom RPC
    const { data: userId, error: findUserError } = await supabaseAdmin.rpc(
      'get_user_id_by_email',
      { email_to_find: email }
    )

    if (findUserError || !userId) {
      console.error('Error finding user or user not found:', findUserError?.message)
      // Return success anyway to avoid email enumeration attacks
      return NextResponse.json({ success: true })
    }

    // 2. Generate a token and set expiration to 1 hour from now
    const token = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString()

    // 3. Save token in our custom table
    const { error: insertError } = await supabaseAdmin
      .from('password_reset_tokens')
      .upsert(
        { user_id: userId, token, expires_at: expiresAt },
        { onConflict: 'user_id' } // Only one active token per user
      )
    
    if (insertError) {
      console.error('Error saving recovery token:', insertError.message)
      return NextResponse.json(
        { error: 'Unable to process the request.' },
        { status: 500 }
      )
    }

    // 4. Create custom recovery link
    const recoveryLink: string = `${origin}/reset-password?token=${token}`

    const gmailUser: string = process.env.GMAIL_USER || ''
    const gmailAppPassword: string = process.env.GMAIL_APP_PASSWORD || ''

    if (!gmailUser || !gmailAppPassword) {
      console.error('GMAIL_USER or GMAIL_APP_PASSWORD not configured')
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      )
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: gmailUser,
        pass: gmailAppPassword,
      },
    })

    const fromName: string = process.env.GMAIL_FROM_NAME || 'Eloop'

    await transporter.sendMail({
      from: `${fromName} <${gmailUser}>`,
      to: email,
      subject: 'Redefinir sua senha - Eloop',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <h1 style="color: #021c54; font-size: 24px; margin-bottom: 24px;">Eloop</h1>
          <h2 style="color: #1F2937; font-size: 18px; margin-bottom: 16px;">Redefinir senha</h2>
          <p style="color: #4B5563; font-size: 14px; line-height: 1.6; margin-bottom: 24px;">
            Você solicitou a redefinição da sua senha. Clique no botão abaixo para criar uma nova senha:
          </p>
          <a href="${recoveryLink}" 
             style="display: inline-block; background-color: #021c54; color: #FFFFFF; 
                    text-decoration: none; padding: 12px 32px; border-radius: 4px; 
                    font-size: 14px; font-weight: bold;">
            Redefinir minha senha
          </a>
          <p style="color: #9CA3AF; font-size: 12px; margin-top: 32px; line-height: 1.5;">
            Se você não solicitou a redefinição de senha, ignore este e-mail.
            Este link expira em 24 horas.
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in reset password route:', error)
    const errorMessage: string =
      error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
