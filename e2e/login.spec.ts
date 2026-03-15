import { test, expect } from '@playwright/test'

test.describe('Login', () => {
  test.use({ storageState: { cookies: [], origins: [] } }) // No pre-auth for login tests

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('/login')

    await page.getByRole('textbox').first().fill(process.env.TEST_USER_EMAIL ?? 'test@fideliza.com')
    await page.getByRole('textbox').nth(1).fill(process.env.TEST_USER_PASSWORD ?? 'Test@123456')

    await page.getByRole('button', { name: /entrar/i }).click()

    // After login, app redirects to / and shows Home
    await expect(page).not.toHaveURL(/\/login/, { timeout: 15000 })
  })

  test('should show error with invalid credentials', async ({ page }) => {
    await page.goto('/login')

    await page.getByRole('textbox').first().fill('invalid@email.com')
    await page.getByRole('textbox').nth(1).fill('wrongpassword')

    await page.getByRole('button', { name: /entrar/i }).click()

    // Wait for error toast
    const errorMessage = page.getByText(/incorretos/i)
    await expect(errorMessage).toBeVisible({ timeout: 10000 })
  })

  test('should navigate to forgot password', async ({ page }) => {
    await page.goto('/login')

    await page.getByText(/esqueci minha senha/i).click()

    await expect(page).toHaveURL(/forgot-password/)
  })
})
