import { test, expect } from '@playwright/test'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL: string = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://127.0.0.1:54321'
const SERVICE_ROLE_KEY: string = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''
const TEST_EMAIL: string = process.env.TEST_USER_EMAIL ?? 'test@fideliza.com'
const TEST_PASSWORD: string = process.env.TEST_USER_PASSWORD ?? 'Test@123456'

// These tests modify shared DB state and must run serially
test.describe.configure({ mode: 'serial' })

test.describe('Create Business', () => {
  let supabase: SupabaseClient
  let userId: string

  // Helper: login via UI and reach create-store page
  async function loginAndReachCreateStore(page: import('@playwright/test').Page): Promise<void> {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    // Fill login form
    const inputs = page.locator('input')
    await inputs.first().fill(TEST_EMAIL)
    await inputs.nth(1).fill(TEST_PASSWORD)
    await page.getByRole('button', { name: /entrar/i }).click()

    // After login with no business, should redirect to create-store
    await expect(page).toHaveURL(/\/store\/create-store/, { timeout: 15000 })
    await expect(page.getByText('Estamos quase lá!')).toBeVisible({ timeout: 15000 })
  }

  test.beforeAll(async () => {
    supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY)

    const { data: signInData } = await supabase.auth.signInWithPassword({
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    })
    userId = signInData.user!.id
    await supabase.auth.signOut()

    // Delete existing data
    const { data: business } = await supabase
      .from('business')
      .select('id')
      .eq('user_id', userId)
      .single()

    if (business) {
      await supabase.from('stamps').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      await supabase.from('cards').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      await supabase.from('person').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      await supabase.from('campaigns').delete().eq('business_id', business.id)
      await supabase.from('business').delete().eq('id', business.id)
    }
  })

  test.afterAll(async () => {
    const { data: existingBiz } = await supabase.from('business')
      .select('id').eq('user_id', userId).single()

    if (existingBiz) {
      const { data: existingCamp } = await supabase.from('campaigns')
        .select('id').eq('business_id', existingBiz.id).single()
      if (!existingCamp) {
        await supabase.from('campaigns').insert({
          business_id: existingBiz.id,
          stamps_required: 10,
          prize: 'Prêmio Teste E2E',
          rule: 'Regra de teste',
        })
      }
      return
    }

    const { data: newBusiness, error: bizError } = await supabase.from('business').insert({
      user_id: userId,
      name: 'Loja Teste E2E',
      cnpj: '00000000000100',
    }).select().single()

    if (!bizError && newBusiness) {
      await supabase.from('campaigns').insert({
        business_id: newBusiness.id,
        stamps_required: 10,
        prize: 'Prêmio Teste E2E',
        rule: 'Regra de teste',
      })
    }
  })

  test('should redirect to create-store after login when no business exists', async ({ page }) => {
    await loginAndReachCreateStore(page)

    // Form should be visible
    await expect(page.getByText('Nome do estabelecimento')).toBeVisible()
    await expect(page.getByText('CNPJ')).toBeVisible()
    await expect(page.getByText('CEP')).toBeVisible()
    await expect(page.getByText('WhatsApp')).toBeVisible()
    await expect(page.getByRole('button', { name: /avançar/i })).toBeVisible()
  })

  test('should show validation errors when submitting empty form', async ({ page }) => {
    await loginAndReachCreateStore(page)

    // Submit empty form
    await page.getByRole('button', { name: /avançar/i }).click()

    // Should show validation errors
    const errorMessages = page.getByText(/campo obrigatório/i)
    await expect(errorMessages.first()).toBeVisible({ timeout: 5000 })
  })

  test('should create business and redirect to create campaign', async ({ page }) => {
    // Mock CEP lookup API
    await page.route('**/viacep.com.br/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          cep: '01001-000',
          logradouro: 'Praça da Sé',
          bairro: 'Sé',
          localidade: 'São Paulo',
          uf: 'SP',
        }),
      })
    })

    await loginAndReachCreateStore(page)

    // Fill form
    await page.getByPlaceholder(/eloop loja/i).fill('Restaurante Teste E2E')
    await page.getByPlaceholder('00.000.000/0000-00').fill('11222333000181')
    await page.getByPlaceholder('00000-000').fill('01001000')
    await page.waitForTimeout(1500)
    await page.getByPlaceholder('(00) 0 0000 0000').fill('11999998888')

    // Submit
    await page.getByRole('button', { name: /avançar/i }).click()

    // Should redirect to create-campaign
    await expect(page).toHaveURL(/\/store\/create-campaign/, { timeout: 15000 })
  })
})
