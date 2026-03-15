import { test, expect } from '@playwright/test'

test.describe('Forgot Password', () => {
  // These tests do NOT need authentication
  test.use({ storageState: { cookies: [], origins: [] } })

  test.beforeEach(async ({ page }) => {
    // Mock the send-email edge function
    await page.route('**/functions/v1/send-email', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      })
    })
    // Mock password reset API call
    await page.route('**/auth/v1/recover', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({}),
      })
    })
  })

  test('should display forgot password page', async ({ page }) => {
    await page.goto('/forgot-password')
    await page.waitForLoadState('networkidle')

    // Should show the title
    const title = page.getByText('Esqueceu sua senha?')
    await expect(title).toBeVisible({ timeout: 10000 })

    // Should show the description
    const description = page.getByText(/informe seu e-mail/i)
    await expect(description).toBeVisible()

    // Should show the email input
    const emailInput = page.getByRole('textbox')
    await expect(emailInput).toBeVisible()

    // Should show the submit button
    const submitButton = page.getByRole('button', { name: /enviar/i })
    await expect(submitButton).toBeVisible()

    // Should show back to login button
    const backButton = page.getByRole('button', { name: /voltar/i })
    await expect(backButton).toBeVisible()
  })

  test('should show validation error for empty email', async ({ page }) => {
    await page.goto('/forgot-password')
    await page.waitForLoadState('networkidle')

    // Click submit without filling email
    await page.getByRole('button', { name: /enviar/i }).click()

    // Should show validation error
    const errorMessage = page.getByText(/required|campo obrigatório|email inválido/i)
    await expect(errorMessage).toBeVisible({ timeout: 5000 })
  })

  test('should navigate to sent page after submitting email', async ({ page }) => {
    await page.goto('/forgot-password')
    await page.waitForLoadState('networkidle')

    // Fill email
    const emailInput = page.getByRole('textbox')
    await emailInput.fill('test@fideliza.com')

    // Click submit
    await page.getByRole('button', { name: /enviar/i }).click()

    // Should navigate to sent confirmation page
    await expect(page).toHaveURL(/\/forgot-password\/sent/, { timeout: 15000 })

    // Should show confirmation message
    const confirmationText = page.getByText(/instruções para redefinir/i)
    await expect(confirmationText).toBeVisible({ timeout: 10000 })

    // Should show "Login" button to go back
    const loginButton = page.getByRole('button', { name: /login/i })
    await expect(loginButton).toBeVisible()
  })

  test('should navigate back to login from forgot password', async ({ page }) => {
    await page.goto('/forgot-password')
    await page.waitForLoadState('networkidle')

    // Click "Voltar" button
    await page.getByRole('link', { name: /voltar/i }).click()

    // Should navigate to login page
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 })
  })

  test('should navigate back to login from sent page', async ({ page }) => {
    await page.goto('/forgot-password')
    await page.waitForLoadState('networkidle')

    // Fill and submit email
    const emailInput = page.getByRole('textbox')
    await emailInput.fill('test@fideliza.com')
    await page.getByRole('button', { name: /enviar/i }).click()

    // Wait for sent page
    await expect(page).toHaveURL(/\/forgot-password\/sent/, { timeout: 15000 })

    // Click Login button
    await page.getByRole('link', { name: /login/i }).click()

    // Should navigate to login
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 })
  })
})
