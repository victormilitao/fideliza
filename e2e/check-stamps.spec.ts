import { test, expect } from '@playwright/test'

test.describe('Check Stamps', () => {
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

  test('should navigate to tickets page after clicking Conferir selos', async ({ page }) => {
    const testPhone = '11999990010'

    // First send a stamp so the person exists
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const phoneInput = page.getByPlaceholder('(00) 0 0000 0000')
    await phoneInput.fill(testPhone)
    await page.getByRole('button', { name: /enviar selo/i }).click()
    await expect(page.getByText('Selo enviado.')).toBeVisible({ timeout: 15000 })

    // Wait for form to reset (phone input clears)
    await expect(phoneInput).toHaveValue('', { timeout: 5000 })

    // Now click "Conferir selos"
    await phoneInput.fill(testPhone)
    await page.getByRole('button', { name: /conferir selos/i }).click()

    // Should navigate to tickets page
    await expect(page).toHaveURL(/\/store\/tickets\?phone=/, { timeout: 10000 })
  })

  test('should display stamps on the tickets page', async ({ page }) => {
    const testPhone = '11999990011'

    // Send a stamp first
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const phoneInput = page.getByPlaceholder('(00) 0 0000 0000')
    await phoneInput.fill(testPhone)
    await page.getByRole('button', { name: /enviar selo/i }).click()
    await expect(page.getByText('Selo enviado.')).toBeVisible({ timeout: 15000 })

    // Wait for form to reset
    await expect(phoneInput).toHaveValue('', { timeout: 5000 })

    // Navigate to tickets
    await phoneInput.fill(testPhone)
    await page.getByRole('button', { name: /conferir selos/i }).click()
    await expect(page).toHaveURL(/\/store\/tickets\?phone=/, { timeout: 10000 })

    // Should show the phone on the tickets page
    const phoneText = page.getByText(/selos de/i)
    await expect(phoneText).toBeVisible({ timeout: 10000 })

    // Should have a "Voltar" button
    const backButton = page.getByRole('link', { name: /voltar/i })
    await expect(backButton).toBeVisible()
  })

  test('should navigate back from tickets page', async ({ page }) => {
    const testPhone = '11999990012'

    // Send a stamp first
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const phoneInput = page.getByPlaceholder('(00) 0 0000 0000')
    await phoneInput.fill(testPhone)
    await page.getByRole('button', { name: /enviar selo/i }).click()
    await expect(page.getByText('Selo enviado.')).toBeVisible({ timeout: 15000 })

    // Wait for form to reset
    await expect(phoneInput).toHaveValue('', { timeout: 5000 })

    // Navigate to tickets
    await phoneInput.fill(testPhone)
    await page.getByRole('button', { name: /conferir selos/i }).click()
    await expect(page).toHaveURL(/\/store\/tickets\?phone=/, { timeout: 10000 })

    // Click "Voltar"
    await page.getByRole('link', { name: /voltar/i }).click()

    // Should go back to home
    await expect(page).not.toHaveURL(/\/store\/tickets/, { timeout: 10000 })
  })

  test('should show 0 stamps for unknown phone number', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const phoneInput = page.getByPlaceholder('(00) 0 0000 0000')
    await phoneInput.fill('11000000000')

    await page.getByRole('button', { name: /conferir selos/i }).click()

    // The app navigates to tickets page and shows 0 stamps
    await expect(page).toHaveURL(/\/store\/tickets\?phone=/, { timeout: 10000 })

    // Should display 0/X stamps
    const stampCount = page.getByText(/0\/\d+/)
    await expect(stampCount).toBeVisible({ timeout: 10000 })
  })
})
