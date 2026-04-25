import { createClient, SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL: string = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://127.0.0.1:54321'
const SUPABASE_KEY: string = process.env.NEXT_PUBLIC_SUPABASE_KEY ?? ''

const TEST_USER_EMAIL: string = process.env.TEST_USER_EMAIL ?? 'test@fideliza.com'
const TEST_USER_PASSWORD: string = process.env.TEST_USER_PASSWORD ?? 'Test@123456'

async function globalSetup(): Promise<void> {
  const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY)

  // 1. Sign up test user via regular auth (not admin API)
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: TEST_USER_EMAIL,
    password: TEST_USER_PASSWORD,
  })

  let userId: string

  if (signUpError) {
    // If user already exists, try to sign in instead
    if (signUpError.message.includes('already') || signUpError.status === 422) {
      console.log(`ℹ️  Test user already exists: ${TEST_USER_EMAIL}`)
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASSWORD,
      })
      if (signInError) {
        throw new Error(`Failed to sign in test user: ${signInError.message}`)
      }
      userId = signInData.user!.id
    } else {
      throw new Error(`Failed to create test user: ${signUpError.message}`)
    }
  } else {
    userId = signUpData.user!.id
    console.log(`✅ Test user created: ${TEST_USER_EMAIL}`)
  }

  // 2. Seed profile (id is auto-generated bigint, role is required)
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (!existingProfile) {
    const { error: profileError } = await supabase.from('profiles').insert({
      user_id: userId,
      role: 'business_owner',
      verified: new Date().toISOString(),
    })

    if (profileError) {
      console.warn(`⚠️  Profile insert warning: ${profileError.message}`)
    } else {
      console.log('✅ Test profile created')
    }
  } else {
    console.log('ℹ️  Test profile already exists')
  }

  // 3. Seed business
  const { data: existingBusiness } = await supabase
    .from('business')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (!existingBusiness) {
    const { error: businessError } = await supabase.from('business').insert({
      user_id: userId,
      name: 'Loja Teste E2E',
      cnpj: '00000000000100',
    })

    if (businessError) {
      console.warn(`⚠️  Business insert warning: ${businessError.message}`)
    } else {
      console.log('✅ Test business created')
    }
  } else {
    console.log('ℹ️  Test business already exists')
  }

  // 4. Seed campaign
  const { data: businessRecord } = await supabase
    .from('business')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (businessRecord) {
    const { data: existingCampaign } = await supabase
      .from('campaigns')
      .select('id')
      .eq('business_id', businessRecord.id)
      .single()

    if (!existingCampaign) {
      const { error: campaignError } = await supabase.from('campaigns').insert({
        business_id: businessRecord.id,
        stamps_required: 10,
        prize: 'Prêmio Teste E2E',
        rule: 'Regra de teste',
      })

      if (campaignError) {
        console.warn(`⚠️  Campaign insert warning: ${campaignError.message}`)
      } else {
        console.log('✅ Test campaign created')
      }
    } else {
      console.log('ℹ️  Test campaign already exists')
    }
  }

  await supabase.auth.signOut()
  console.log('✅ Global setup complete')
}

export default globalSetup
