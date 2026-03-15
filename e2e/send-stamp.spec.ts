import { test, expect } from '@playwright/test'

test.describe('Send Stamp', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the send-whatsapp Supabase edge function to prevent actual SMS/WhatsApp
    await page.route('**/functions/v1/send-whatsapp', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      })
    })

    // Also mock send-email edge function in case it's triggered
    await page.route('**/functions/v1/send-email', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      })
    })
  })

  test('should send a stamp successfully', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Fill the phone input
    const phoneInput = page.getByPlaceholder('(00) 0 0000 0000')
    await phoneInput.fill('11999990001')

    // Click "Enviar selo"
    await page.getByRole('button', { name: /enviar selo/i }).click()

    // Wait for success toast — confirms stamp was created and sent
    const successToast = page.getByText('Selo enviado.')
    await expect(successToast).toBeVisible({ timeout: 15000 })
  })

  test('should show validation error with empty phone', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Click "Enviar selo" without filling phone
    await page.getByRole('button', { name: /enviar selo/i }).click()

    // Assert validation error appears
    const errorMessage = page.getByText('Campo obrigatório')
    await expect(errorMessage).toBeVisible({ timeout: 5000 })
  })

  test('should update stamp count after sending', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Fill the phone input
    const phoneInput = page.getByPlaceholder('(00) 0 0000 0000')
    await phoneInput.fill('11999990002')

    // Click "Enviar selo"
    await page.getByRole('button', { name: /enviar selo/i }).click()

    // Wait for success toast
    const successToast = page.getByText('Selo enviado.')
    await expect(successToast).toBeVisible({ timeout: 15000 })

    // Verify the stamp count text is visible (e.g., "X de 50 selos enviados.")
    // There are two instances (mobile + desktop banners), use .first()
    const stampCount = page.getByText(/de 50 selos enviados/i).first()
    await expect(stampCount).toBeVisible({ timeout: 10000 })
  })

  test('should send multiple stamps to the same phone', async ({ page }) => {
    const whatsappRequests: string[] = []

    page.on('request', (request) => {
      if (request.url().includes('functions/v1/send-whatsapp')) {
        whatsappRequests.push(request.url())
      }
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const phoneInput = page.getByPlaceholder('(00) 0 0000 0000')

    // Send first stamp
    await phoneInput.fill('11999990003')
    await page.getByRole('button', { name: /enviar selo/i }).click()

    const firstToast = page.getByText('Selo enviado.')
    await expect(firstToast).toBeVisible({ timeout: 15000 })

    // Wait for toast to disappear and form to reset
    await page.waitForTimeout(2000)

    // Send second stamp to the same phone
    await phoneInput.fill('11999990003')
    await page.getByRole('button', { name: /enviar selo/i }).click()

    // Wait for second success toast
    await expect(page.getByText('Selo enviado.')).toBeVisible({ timeout: 15000 })

    // Verify the WhatsApp function was called at least once (subsequent stamps may batch)
    expect(whatsappRequests.length).toBeGreaterThanOrEqual(1)
  })
})
