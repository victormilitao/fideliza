import { test, expect } from '@playwright/test'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL: string = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://127.0.0.1:54321'
const SUPABASE_SERVICE_ROLE_KEY: string = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
const SUPABASE_KEY: string = process.env.NEXT_PUBLIC_SUPABASE_KEY ?? ''
const TEST_USER_EMAIL: string = process.env.TEST_USER_EMAIL ?? 'test@fideliza.com'
const TEST_USER_PASSWORD: string = process.env.TEST_USER_PASSWORD ?? 'Test@123456'

// Use service role key to bypass RLS, fall back to anon key
const DB_KEY: string = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_KEY

/**
 * Helper to get the test business ID from Supabase.
 */
async function getTestBusinessId(supabase: SupabaseClient): Promise<string | null> {
  const authClient: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY)
  const { data: signInData } = await authClient.auth.signInWithPassword({
    email: TEST_USER_EMAIL,
    password: TEST_USER_PASSWORD,
  })

  if (!signInData?.user) return null

  const { data: business } = await supabase
    .from('business')
    .select('id')
    .eq('user_id', signInData.user.id)
    .single()

  await authClient.auth.signOut()
  return business?.id ?? null
}

/**
 * Helper to seed a business_subscription record with a given status.
 */
async function seedSubscription(
  supabase: SupabaseClient,
  businessId: string,
  options: {
    status: string
    subscriptionStatus: string | null
    paymentStatus: string
  }
): Promise<void> {
  // Clean existing subscriptions for this business first
  await supabase
    .from('business_subscriptions')
    .delete()
    .eq('business_id', businessId)

  // Insert the subscription with desired state
  const { error } = await supabase.from('business_subscriptions').insert({
    business_id: businessId,
    stripe_customer_id: 'cus_test_e2e',
    stripe_subscription_id: 'sub_test_e2e',
    stripe_session_id: `cs_test_e2e_${Date.now()}`,
    payment_status: options.paymentStatus,
    subscription_status: options.subscriptionStatus,
    status: options.status,
  })

  if (error) {
    console.error('Error seeding subscription:', error)
  }
}

/**
 * Helper to clean up subscription data.
 */
async function cleanSubscriptions(supabase: SupabaseClient, businessId: string): Promise<void> {
  await supabase
    .from('business_subscriptions')
    .delete()
    .eq('business_id', businessId)
}

/**
 * Navigate to the "Minha conta" tab in Settings.
 * Clears React Query cache to avoid stale subscription data.
 */
async function navigateToMyAccount(page: import('@playwright/test').Page): Promise<void> {
  await page.goto('/store/settings')
  await page.waitForLoadState('networkidle')

  // Clear React Query cache to force fresh data fetch
  await page.evaluate(() => {
    // Access and clear the React Query cache via window
    const queryClient = (window as any).__REACT_QUERY_CLIENT__
    if (queryClient) {
      queryClient.clear()
    }
  })

  // Click "Minha conta" tab
  const accountTab = page.getByRole('button', { name: /minha conta/i })
  await expect(accountTab).toBeVisible({ timeout: 10000 })
  await accountTab.click()

  // Wait for subscription data to load (spinner to disappear)
  await page.waitForTimeout(2000)
}

// Force serial execution — tests modify shared DB state
test.describe.configure({ mode: 'serial' })

test.describe('Subscription Management', () => {
  let supabase: SupabaseClient
  let businessId: string | null

  test.beforeAll(async () => {
    supabase = createClient(SUPABASE_URL, DB_KEY)
    businessId = await getTestBusinessId(supabase)
  })

  test.afterAll(async () => {
    // Final cleanup
    if (businessId) {
      await cleanSubscriptions(supabase, businessId)
    }
  })

  // ─── ACTIVE PLAN TESTS ───────────────────────────────────────
  test.describe('Active Plan State', () => {
    test('should display active plan with correct info and buttons', async ({ page }) => {
      if (!businessId) test.skip()

      // Seed active subscription
      await seedSubscription(supabase, businessId!, {
        status: 'complete',
        subscriptionStatus: null,
        paymentStatus: 'paid',
      })

      await navigateToMyAccount(page)

      // Should show "Plano ativo" heading
      const heading = page.getByText('Plano ativo')
      await expect(heading).toBeVisible({ timeout: 15000 })

      // Should show the price
      await expect(page.getByText('R$ 27,90/mês')).toBeVisible()

      // Should show "Próxima cobrança"
      await expect(page.getByText('Próxima cobrança')).toBeVisible()

      // Should show action buttons
      await expect(page.getByRole('button', { name: /trocar cartão/i })).toBeVisible()
      await expect(page.getByRole('button', { name: /cancelar plano/i })).toBeVisible()
      await expect(page.getByRole('button', { name: /acessar página inicial/i })).toBeVisible()
    })
  })

  // ─── PENDING CANCELLATION TESTS ──────────────────────────────
  test.describe('Pending Cancellation State', () => {
    test('should display cancellation scheduled info with reactivate button', async ({ page }) => {
      if (!businessId) test.skip()

      // Seed pending cancellation subscription
      await seedSubscription(supabase, businessId!, {
        status: 'complete',
        subscriptionStatus: 'pending_cancellation',
        paymentStatus: 'paid',
      })

      await navigateToMyAccount(page)

      // Should show "Cancelamento agendado" heading
      const heading = page.getByText('Cancelamento agendado')
      await expect(heading).toBeVisible({ timeout: 15000 })

      // Should show date info
      await expect(page.getByText('Plano ativo até')).toBeVisible()
      await expect(page.getByText('Última cobrança')).toBeVisible()

      // Should show "Reativar plano" button
      await expect(page.getByRole('button', { name: /reativar plano/i })).toBeVisible()

      // Should NOT show cancel or change card buttons
      await expect(page.getByRole('button', { name: /cancelar plano/i })).not.toBeVisible()
      await expect(page.getByRole('button', { name: /trocar cartão/i })).not.toBeVisible()

      // Should show homepage link
      await expect(page.getByRole('button', { name: /acessar página inicial/i })).toBeVisible()
    })
  })

  // ─── FULLY CANCELLED TESTS ──────────────────────────────────
  test.describe('Fully Cancelled State', () => {
    test('should display plan ended info with view plans button', async ({ page }) => {
      if (!businessId) test.skip()

      // Seed fully cancelled subscription
      await seedSubscription(supabase, businessId!, {
        status: 'complete',
        subscriptionStatus: 'canceled',
        paymentStatus: 'paid',
      })

      await navigateToMyAccount(page)

      // Should show "Plano encerrado" heading
      const heading = page.getByText('Plano encerrado')
      await expect(heading).toBeVisible({ timeout: 15000 })

      // Should show "Ver plano" button
      await expect(page.getByRole('button', { name: /ver plano/i })).toBeVisible()

      // Should NOT show reactivate button
      await expect(page.getByRole('button', { name: /reativar plano/i })).not.toBeVisible()
    })

    test('should navigate to payment from fully cancelled state', async ({ page }) => {
      if (!businessId) test.skip()

      // Seed fully cancelled subscription
      await seedSubscription(supabase, businessId!, {
        status: 'complete',
        subscriptionStatus: 'canceled',
        paymentStatus: 'paid',
      })

      await navigateToMyAccount(page)

      await expect(page.getByText('Plano encerrado')).toBeVisible({ timeout: 15000 })

      // Click "Ver plano"
      await page.getByRole('button', { name: /ver plano/i }).click()

      // Should navigate to payment page
      await expect(page).toHaveURL(/\/store\/payment/, { timeout: 10000 })
    })
  })

  // ─── NO SUBSCRIPTION (TRIAL) TESTS ──────────────────────────
  test.describe('No Subscription (Trial) State', () => {
    test('should display pricing card when no subscription', async ({ page }) => {
      if (!businessId) test.skip()

      // Clean all subscriptions to ensure trial state
      await cleanSubscriptions(supabase, businessId!)

      await navigateToMyAccount(page)

      // Should show pricing title (use .first() as text matches heading + paragraph)
      const title = page.getByText(/continue enviando selos/i).first()
      await expect(title).toBeVisible({ timeout: 15000 })

      // Should show the price
      await expect(page.getByText('27,90')).toBeVisible()

      // Should show CTA
      await expect(page.getByRole('button', { name: /continuar para pagamento/i })).toBeVisible()
    })

    test('should navigate to payment from trial state', async ({ page }) => {
      if (!businessId) test.skip()

      // Clean all subscriptions to ensure trial state
      await cleanSubscriptions(supabase, businessId!)

      await navigateToMyAccount(page)

      await expect(page.getByText('27,90')).toBeVisible({ timeout: 15000 })

      // Click CTA
      await page.getByRole('button', { name: /continuar para pagamento/i }).click()

      // Should navigate to payment page
      await expect(page).toHaveURL(/\/store\/payment/, { timeout: 10000 })
    })
  })
})
