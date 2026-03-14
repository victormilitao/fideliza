import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

type EmailRequestBody = {
  to: string
  subject: string
  html: string
}

export async function POST(request: NextRequest) {
  try {
    const body: EmailRequestBody = await request.json()
    const { to, subject, html } = body

    if (!to || !subject || !html) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: to, subject, html' },
        { status: 400 }
      )
    }

    const gmailUser: string = process.env.GMAIL_USER || ''
    const gmailAppPassword: string = process.env.GMAIL_APP_PASSWORD || ''

    if (!gmailUser || !gmailAppPassword) {
      console.error('GMAIL_USER ou GMAIL_APP_PASSWORD não configurados')
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
      to,
      subject,
      html,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao enviar email:', error)
    const errorMessage: string =
      error instanceof Error ? error.message : 'Erro desconhecido'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
