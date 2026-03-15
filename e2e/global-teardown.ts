import { createClient, SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL: string = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://127.0.0.1:54321'
const SUPABASE_KEY: string = process.env.NEXT_PUBLIC_SUPABASE_KEY ?? ''
const TEST_USER_EMAIL: string = process.env.TEST_USER_EMAIL ?? 'test@fideliza.com'
const TEST_USER_PASSWORD: string = process.env.TEST_USER_PASSWORD ?? 'Test@123456'

async function globalTeardown(): Promise<void> {
  const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY)

  // Sign in as test user to get their ID
  const { data: signInData } = await supabase.auth.signInWithPassword({
    email: TEST_USER_EMAIL,
    password: TEST_USER_PASSWORD,
  })

  if (signInData?.user) {
    const userId: string = signInData.user.id

    // Clean up business-related data
    const { data: business } = await supabase
      .from('business')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (business) {
      // Get all campaigns for this business to clean related data
      const { data: campaigns } = await supabase
        .from('campaigns')
        .select('id')
        .eq('business_id', business.id)

      if (campaigns && campaigns.length > 0) {
        const campaignIds: string[] = campaigns.map((c: { id: string }) => c.id)

        // Get all cards for these campaigns to clean stamps and person records
        const { data: cards } = await supabase
          .from('cards')
          .select('id, person_id')
          .in('campaign_id', campaignIds)

        if (cards && cards.length > 0) {
          const cardIds: string[] = cards.map((c: { id: string }) => c.id)
          const personIds: string[] = [...new Set(cards.map((c: { person_id: string }) => c.person_id))]

          await supabase.from('stamps').delete().in('card_id', cardIds)
          await supabase.from('cards').delete().in('id', cardIds)
          await supabase.from('person').delete().in('id', personIds)
        }
      }

      await supabase.from('stamps').delete().eq('business_id', business.id)
      await supabase.from('campaigns').delete().eq('business_id', business.id)
      await supabase.from('business').delete().eq('id', business.id)
    }

    await supabase.from('profiles').delete().eq('id', userId)
    await supabase.auth.signOut()
  }

  // Note: We don't delete the auth user since we can't use admin API with EdDSA keys.
  // The user will be reused on next run.
  console.log('🧹 Global teardown complete')
}

export default globalTeardown
