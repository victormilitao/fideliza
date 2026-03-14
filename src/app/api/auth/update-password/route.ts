import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

type UpdatePasswordRequestBody = {
  token: string
  password?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: UpdatePasswordRequestBody = await request.json()
    const { token, password } = body

    if (!token) {
      return NextResponse.json(
        { error: 'Required field: token' },
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

    // Must use Service Role key to bypass RLS and change another user's password
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    // 1. Validate if token exists and is valid
    const { data: tokenData, error: tokenError } = await supabaseAdmin
      .from('password_reset_tokens')
      .select('user_id, expires_at')
      .eq('token', token)
      .single()

    if (tokenError || !tokenData) {
      return NextResponse.json(
        { error: 'Token inválido ou expirado.' },
        { status: 400 }
      )
    }

    const isExpired = new Date(tokenData.expires_at).getTime() < Date.now()
    if (isExpired) {
      return NextResponse.json(
        { error: 'Este link de recuperação expirou. Solicite um novo.' },
        { status: 400 }
      )
    }

    // 2. If password was provided, actually update the user's password
    if (password) {
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        tokenData.user_id,
        { password }
      )

      if (updateError) {
        console.error('Error updating password:', updateError.message)
        return NextResponse.json(
          { error: 'Não foi possível atualizar a senha no momento.' },
          { status: 500 }
        )
      }

      // 3. Delete the token so it cannot be used again
      await supabaseAdmin
        .from('password_reset_tokens')
        .delete()
        .eq('token', token)
        
      return NextResponse.json({ success: true, message: 'Senha atualizada' })
    }

    // If password was empty, this is just a validation request
    return NextResponse.json({ success: true, valid: true })

  } catch (error) {
    console.error('Error in update password route:', error)
    const errorMessage: string =
      error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
