import { test as setup, expect } from '@playwright/test'

const TEST_USER_EMAIL: string = process.env.TEST_USER_EMAIL ?? 'test@fideliza.com'
const TEST_USER_PASSWORD: string = process.env.TEST_USER_PASSWORD ?? 'Test@123456'
const AUTH_FILE: string = 'e2e/.auth/user.json'

setup('authenticate', async ({ page }) => {
  await page.goto('/login')

  // Input component uses div labels, not <label> elements — use textbox role
  await page.getByRole('textbox').first().fill(TEST_USER_EMAIL)
  await page.getByRole('textbox').nth(1).fill(TEST_USER_PASSWORD)

  await page.getByRole('button', { name: /entrar/i }).click()

  // After login, useAuth does router.push('/'), root page renders <Home />
  // Wait for the page to NOT be on /login anymore
  await expect(page).not.toHaveURL(/\/login/, { timeout: 15000 })

  // Save signed-in state
  await page.context().storageState({ path: AUTH_FILE })
})
