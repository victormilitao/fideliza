import { test, expect } from '@playwright/test'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL: string = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://127.0.0.1:54321'
const SERVICE_ROLE_KEY: string = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
const TEST_EMAIL: string = process.env.TEST_USER_EMAIL ?? 'test@fideliza.com'
const TEST_PASSWORD: string = process.env.TEST_USER_PASSWORD ?? 'Test@123456'

// These tests modify shared DB state and must run serially
test.describe.configure({ mode: 'serial' })

test.describe('Create Campaign', () => {
  let supabase: SupabaseClient
  let businessId: string

  // Helper: navigate to create-campaign, logging in if needed
  async function reachCreateCampaign(page: import('@playwright/test').Page): Promise<void> {
    await page.goto('/')
    await page.waitForURL(/\/(store\/create-campaign|login)/, { timeout: 15000 })

    if (page.url().includes('/login')) {
      const inputs = page.locator('input')
      await inputs.first().fill(TEST_EMAIL)
      await inputs.nth(1).fill(TEST_PASSWORD)
      await page.getByRole('button', { name: /entrar/i }).click()
      await expect(page).toHaveURL(/\/store\/create-campaign/, { timeout: 15000 })
    }

    await expect(page.getByText('Este é o último passo!')).toBeVisible({ timeout: 15000 })
  }

  test.beforeAll(async () => {
    supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

    // Get test user ID
    const { data: signInData } = await supabase.auth.signInWithPassword({
      email: TEST_EMAIL, password: TEST_PASSWORD,
    })
    const userId: string = signInData.user!.id
    await supabase.auth.signOut()

    // Get the test business ID by user_id
    const { data: business } = await supabase
      .from('business')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (!business) throw new Error('Test business not found')
    businessId = business.id

    // Delete existing campaigns so the redirect flow sends us to create-campaign
    await supabase.from('stamps').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('cards').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('campaigns').delete().eq('business_id', businessId)
  })

  test.afterAll(async () => {
    // Re-create the campaign so other tests work
    const { data: existingCamp } = await supabase.from('campaigns')
      .select('id').eq('business_id', businessId).single()

    if (!existingCamp) {
      await supabase.from('campaigns').insert({
        business_id: businessId,
        stamps_required: 10,
        prize: 'Prêmio Teste E2E',
        rule: 'Regra de teste',
      })
    }
  })

  test('should redirect to create-campaign when no campaign exists', async ({ page }) => {
    await reachCreateCampaign(page)
    // reachCreateCampaign already validates the form is visible
  })

  test('should display create campaign form', async ({ page }) => {
    await reachCreateCampaign(page)

    // Should show form fields
    await expect(page.getByText(/como o cliente ganha um selo/i)).toBeVisible()
    await expect(page.getByText(/qual será o prêmio/i)).toBeVisible()
    await expect(page.getByText(/quantos selos serão necessários/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /criar/i })).toBeVisible()
  })

  test('should show validation errors when submitting empty form', async ({ page }) => {
    await reachCreateCampaign(page)

    // Clear the default stamps_required value
    const stampsInput = page.getByPlaceholder('10')
    await stampsInput.clear()

    // Click submit without filling any fields
    await page.getByRole('button', { name: /criar/i }).click()

    // Should show validation errors
    const errorMessages = page.getByText(/campo obrigatório|required/i)
    await expect(errorMessages.first()).toBeVisible({ timeout: 5000 })
  })

  test('should create campaign successfully', async ({ page }) => {
    await reachCreateCampaign(page)

    // Fill the rule textarea
    await page.getByPlaceholder(/a cada compra/i).fill('A cada compra acima de R$30,00 o cliente ganha um selo')

    // Fill the prize textarea
    await page.getByPlaceholder(/uma pizza/i).fill('Uma sobremesa grátis')

    // stamps_required defaults to 5, change it
    const stampsInput = page.getByPlaceholder('10')
    await stampsInput.clear()
    await stampsInput.fill('8')

    // Submit form
    await page.getByRole('button', { name: /criar/i }).click()

    // Should redirect away from create-campaign after success
    await expect(page).not.toHaveURL(/\/store\/create-campaign/, { timeout: 15000 })
  })
})
