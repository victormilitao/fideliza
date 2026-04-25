import { test, expect } from '@playwright/test'

test.describe('Payment Page', () => {
  test('should display payment plan page', async ({ page }) => {
    await page.goto('/store/payment')
    await page.waitForLoadState('networkidle')

    // Should show the plan title
    const planTitle = page.getByRole('heading', { name: /continue enviando selos/i })
    await expect(planTitle).toBeVisible({ timeout: 15000 })

    // Should show the price
    const price = page.getByText('27,90')
    await expect(price).toBeVisible()
  })

  test('should display plan benefits', async ({ page }) => {
    await page.goto('/store/payment')
    await page.waitForLoadState('networkidle')

    // Wait for the plan to load
    await expect(page.getByText('27,90')).toBeVisible({ timeout: 15000 })

    // Should show key benefits
    const unlimitedStamps = page.getByText(/ilimitados/i)
    await expect(unlimitedStamps).toBeVisible()

    const noFees = page.getByText(/sem taxas/i)
    await expect(noFees).toBeVisible()

    const cancelAnytime = page.getByText(/cancelamento a qualquer momento/i)
    await expect(cancelAnytime).toBeVisible()
  })

  test('should show continue to payment button', async ({ page }) => {
    await page.goto('/store/payment')
    await page.waitForLoadState('networkidle')

    // Wait for the plan to load
    await expect(page.getByText('27,90')).toBeVisible({ timeout: 15000 })

    // Should show the CTA button
    const ctaButton = page.getByRole('button', { name: /continuar para pagamento/i })
    await expect(ctaButton).toBeVisible()
  })

  test('should show back button on payment page', async ({ page }) => {
    await page.goto('/store/payment')
    await page.waitForLoadState('networkidle')

    // Wait for the plan to load
    await expect(page.getByText('27,90')).toBeVisible({ timeout: 15000 })

    // Should show the back button
    const backButton = page.getByRole('button', { name: /voltar/i })
    await expect(backButton).toBeVisible()
  })

  test('should navigate back from payment page', async ({ page }) => {
    await page.goto('/store/payment')
    await page.waitForLoadState('networkidle')

    // Wait for the plan to load
    await expect(page.getByText('27,90')).toBeVisible({ timeout: 15000 })

    // Click "Voltar"
    await page.getByRole('button', { name: /voltar/i }).click()

    // Should navigate to store
    await expect(page).toHaveURL(/\/store/, { timeout: 10000 })
    await expect(page).not.toHaveURL(/\/payment/)
  })

  test('should display trial stamp banner on home page', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Should show the trial stamp count banner
    const stampBanner = page.getByText(/de 50 selos enviados/i).first()
    await expect(stampBanner).toBeVisible({ timeout: 10000 })

    // Should show "Ver plano" button
    const planButton = page.getByRole('button', { name: /ver plano/i }).first()
    await expect(planButton).toBeVisible()
  })

  test('should navigate to payment page from trial banner', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Click "Ver plano" button
    const planButton = page.getByRole('button', { name: /ver plano/i }).first()
    await expect(planButton).toBeVisible({ timeout: 10000 })
    await planButton.click()

    // Should navigate to payment page
    await expect(page).toHaveURL(/\/store\/payment/, { timeout: 10000 })
  })
})
