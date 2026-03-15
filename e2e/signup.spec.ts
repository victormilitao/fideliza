import { test, expect } from '@playwright/test'

test.describe('Signup', () => {
  // These tests do NOT need authentication
  test.use({ storageState: { cookies: [], origins: [] } })

  test('should display signup page', async ({ page }) => {
    await page.goto('/store/create')
    await page.waitForLoadState('networkidle')

    // Should show the welcome title
    const title = page.getByText('Bem-vindo!')
    await expect(title).toBeVisible({ timeout: 10000 })

    // Should show the description
    const description = page.getByText(/vamos criar seu programa de fidelidade/i)
    await expect(description).toBeVisible()

    // Should show email field prompt
    const emailPrompt = page.getByText(/qual.*e-mail.*quer usar/i)
    await expect(emailPrompt).toBeVisible()

    // Should show password field
    const passwordLabel = page.getByText(/crie uma senha/i)
    await expect(passwordLabel).toBeVisible()

    // Should show submit button
    const submitButton = page.getByRole('button', { name: /avançar/i })
    await expect(submitButton).toBeVisible()
  })

  test('should show validation error for empty email', async ({ page }) => {
    await page.goto('/store/create')
    await page.waitForLoadState('networkidle')

    // Wait for form
    await expect(page.getByText('Bem-vindo!')).toBeVisible({ timeout: 10000 })

    // Fill only password, leave email empty
    const passwordInput = page.locator('input[type="password"]')
    await passwordInput.fill('Test@123456')

    // Submit — should trigger validation
    await page.getByRole('button', { name: /avançar/i }).click()

    // Should show email validation error
    const errorMessage = page.getByText(/email inválido|required/i)
    await expect(errorMessage).toBeVisible({ timeout: 5000 })
  })

  test('should show validation error for short password', async ({ page }) => {
    await page.goto('/store/create')
    await page.waitForLoadState('networkidle')

    // Wait for form
    await expect(page.getByText('Bem-vindo!')).toBeVisible({ timeout: 10000 })

    // Fill valid email and short password
    const emailInput = page.locator('input[type="email"]')
    await emailInput.fill('newuser@test.com')

    const passwordInput = page.locator('input[type="password"]')
    await passwordInput.fill('123')

    // Submit
    await page.getByRole('button', { name: /avançar/i }).click()

    // Should show password validation error
    const errorMessage = page.getByText(/mínimo 6 caracteres/i)
    await expect(errorMessage).toBeVisible({ timeout: 5000 })
  })

  test('should show error for existing user', async ({ page }) => {
    await page.goto('/store/create')
    await page.waitForLoadState('networkidle')

    // Wait for form
    await expect(page.getByText('Bem-vindo!')).toBeVisible({ timeout: 10000 })

    // Try to sign up with the existing test user email
    const emailInput = page.locator('input[type="email"]')
    await emailInput.fill('test@fideliza.com')

    const passwordInput = page.locator('input[type="password"]')
    await passwordInput.fill('Test@123456')

    // Submit
    await page.getByRole('button', { name: /avançar/i }).click()

    // Should show a toast error for existing user
    const errorToast = page.getByText(/usuário já existente|already/i)
    await expect(errorToast).toBeVisible({ timeout: 10000 })
  })

  test('should navigate to login from signup page', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    // Click "Criar programa de fidelidade" link
    const createLink = page.getByRole('link', { name: /criar programa de fidelidade/i })
    await expect(createLink).toBeVisible({ timeout: 10000 })
    await createLink.click()

    // Should navigate to signup page
    await expect(page).toHaveURL(/\/store\/create/, { timeout: 10000 })

    // Should show the signup form
    const title = page.getByText('Bem-vindo!')
    await expect(title).toBeVisible({ timeout: 10000 })
  })
})
