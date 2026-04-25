import { test, expect } from '@playwright/test'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

const SUPABASE_URL: string = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://127.0.0.1:54321'
const SUPABASE_SERVICE_KEY: string = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

test.describe('Reward', () => {
  test.beforeEach(async ({ page }) => {
    // Mock edge functions
    await page.route('**/functions/v1/send-whatsapp', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      })
    })
    await page.route('**/functions/v1/send-email', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      })
    })
  })

  test('should show error when trying to reward a phone without completed card', async ({ page }) => {
    const testPhone = '11999990020'

    // Send a single stamp (not enough to complete the card)
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const phoneInput = page.getByPlaceholder('(00) 0 0000 0000')
    await phoneInput.fill(testPhone)
    await page.getByRole('button', { name: /enviar selo/i }).click()
    await expect(page.getByText('Selo enviado.')).toBeVisible({ timeout: 15000 })

    // Wait for form to reset
    await expect(phoneInput).toHaveValue('', { timeout: 5000 })

    // Try to reward — card is not completed
    await phoneInput.fill(testPhone)
    await page.getByRole('button', { name: /premiar$/i }).click()

    // Should show error toast (card not found or not completed)
    const errorMessage = page.getByText(/não encontrad|erro/i)
    await expect(errorMessage).toBeVisible({ timeout: 10000 })
  })

  test('should open reward bottom sheet for completed card and reward successfully', async ({ page }) => {
    const testPhone = '11999990021'
    const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    // Send a stamp via UI to create the person and card
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const phoneInput = page.getByPlaceholder('(00) 0 0000 0000')
    await phoneInput.fill(testPhone)
    await page.getByRole('button', { name: /enviar selo/i }).click()
    await expect(page.getByText('Selo enviado.')).toBeVisible({ timeout: 15000 })

    // Now seed the remaining stamps directly in DB to complete the card
    // First get the person and card
    const sanitizedPhone: string = testPhone.replace(/\D/g, '')
    const { data: person } = await supabase
      .from('person')
      .select('id')
      .eq('phone', sanitizedPhone)
      .single()

    if (!person) throw new Error('Person not found after stamp send')

    const { data: card } = await supabase
      .from('cards')
      .select('id, campaign_id')
      .eq('person_id', person.id)
      .single()

    if (!card) throw new Error('Card not found after stamp send')

    // Get campaign stamps_required
    const { data: campaign } = await supabase
      .from('campaigns')
      .select('stamps_required')
      .eq('id', card.campaign_id)
      .single()

    if (!campaign) throw new Error('Campaign not found')

    // Get current stamps count
    const { data: stamps } = await supabase
      .from('stamps')
      .select('id')
      .eq('card_id', card.id)

    const currentCount: number = stamps?.length || 0
    const remaining: number = (campaign.stamps_required || 10) - currentCount

    // Insert remaining stamps to complete the card
    if (remaining > 0) {
      const stampRows = Array.from({ length: remaining }, () => ({
        card_id: card.id,
        person_id: person.id,
      }))
      await supabase.from('stamps').insert(stampRows)
    }

    // Mark card as completed with a known prize code
    const prizeCode = '1234'
    await supabase
      .from('cards')
      .update({ completed_at: new Date().toISOString(), prize_code: prizeCode })
      .eq('id', card.id)

    // Reload the page to refresh data
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Click "Premiar" with the phone
    await page.getByPlaceholder('(00) 0 0000 0000').fill(testPhone)
    await page.getByRole('button', { name: /premiar$/i }).click()

    // Wait for the bottom sheet with OTP input to appear
    const instructionText = page.getByText(/digite abaixo o código/i)
    await expect(instructionText).toBeVisible({ timeout: 10000 })

    // Fill in the OTP code
    // Each slot gets one digit — type digit by digit using keyboard
    await page.keyboard.type(prizeCode)

    // Click the "Premiar" button inside the bottom sheet form
    const rewardButton = page.getByRole('button', { name: /premiar$/i })
    await rewardButton.click()

    // Should show success toast
    const successToast = page.getByText('Premiação realizada.')
    await expect(successToast).toBeVisible({ timeout: 10000 })
  })

  test('should show error for incorrect reward code', async ({ page }) => {
    const testPhone = '11999990022'
    const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

    // Send a stamp via UI
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const phoneInput = page.getByPlaceholder('(00) 0 0000 0000')
    await phoneInput.fill(testPhone)
    await page.getByRole('button', { name: /enviar selo/i }).click()
    await expect(page.getByText('Selo enviado.')).toBeVisible({ timeout: 15000 })

    // Seed completed card in DB
    const sanitizedPhone: string = testPhone.replace(/\D/g, '')
    const { data: person } = await supabase
      .from('person')
      .select('id')
      .eq('phone', sanitizedPhone)
      .single()

    if (!person) throw new Error('Person not found')

    const { data: card } = await supabase
      .from('cards')
      .select('id, campaign_id')
      .eq('person_id', person.id)
      .single()

    if (!card) throw new Error('Card not found')

    const { data: campaign } = await supabase
      .from('campaigns')
      .select('stamps_required')
      .eq('id', card.campaign_id)
      .single()

    const { data: stamps } = await supabase
      .from('stamps')
      .select('id')
      .eq('card_id', card.id)

    const remaining: number = (campaign?.stamps_required || 10) - (stamps?.length || 0)
    if (remaining > 0) {
      const stampRows = Array.from({ length: remaining }, () => ({
        card_id: card.id,
        person_id: person.id,
      }))
      await supabase.from('stamps').insert(stampRows)
    }

    // Mark as completed with a specific code
    await supabase
      .from('cards')
      .update({ completed_at: new Date().toISOString(), prize_code: '9999' })
      .eq('id', card.id)

    // Reload and try to reward with wrong code
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    await page.getByPlaceholder('(00) 0 0000 0000').fill(testPhone)
    await page.getByRole('button', { name: /premiar$/i }).click()

    await expect(page.getByText(/digite abaixo o código/i)).toBeVisible({ timeout: 10000 })

    // Type wrong code
    await page.keyboard.type('0000')

    await page.getByRole('button', { name: /premiar$/i }).click()

    // Should show error toast
    const errorToast = page.getByText(/código informado está incorreto/i)
    await expect(errorToast).toBeVisible({ timeout: 10000 })
  })
})
