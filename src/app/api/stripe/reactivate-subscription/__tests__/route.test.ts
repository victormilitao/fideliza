/// <reference types="vitest" />
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock Stripe before importing the route
const mockUpdate = vi.fn()
vi.mock('stripe', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      subscriptions: {
        update: mockUpdate,
      },
    })),
  }
})

// Store original env
const originalEnv = { ...process.env }

describe('POST /api/stripe/reactivate-subscription', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.resetModules()
    process.env = { ...originalEnv, STRIPE_SECRET_KEY: 'sk_test_fake_key' }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  async function callRoute(body: Record<string, unknown> | string) {
    const { POST } = await import('../route')
    const request = new Request('http://localhost/api/stripe/reactivate-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: typeof body === 'string' ? body : JSON.stringify(body),
    })
    // NextRequest extends Request, so we can pass a standard Request
    return POST(request as any)
  }

  it('should reactivate subscription successfully', async () => {
    const mockSubscription = {
      id: 'sub_123',
      cancel_at_period_end: false,
      status: 'active',
    }
    mockUpdate.mockResolvedValue(mockSubscription)

    const response = await callRoute({ subscription_id: 'sub_123' })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.subscription).toEqual(mockSubscription)
    expect(mockUpdate).toHaveBeenCalledWith('sub_123', {
      cancel_at_period_end: false,
    })
  })

  it('should return 400 when subscription_id is missing', async () => {
    const response = await callRoute({})
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Required field: subscription_id')
    expect(mockUpdate).not.toHaveBeenCalled()
  })

  it('should return 400 when subscription_id is empty string', async () => {
    const response = await callRoute({ subscription_id: '' })
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Required field: subscription_id')
  })

  it('should return 500 when STRIPE_SECRET_KEY is not configured', async () => {
    process.env.STRIPE_SECRET_KEY = ''

    const response = await callRoute({ subscription_id: 'sub_123' })
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Stripe service not configured')
    expect(mockUpdate).not.toHaveBeenCalled()
  })

  it('should return 500 when STRIPE_SECRET_KEY is undefined', async () => {
    delete process.env.STRIPE_SECRET_KEY

    const response = await callRoute({ subscription_id: 'sub_123' })
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Stripe service not configured')
  })

  it('should return 500 when Stripe throws an error', async () => {
    mockUpdate.mockRejectedValue(new Error('No such subscription: sub_invalid'))

    const response = await callRoute({ subscription_id: 'sub_invalid' })
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('No such subscription: sub_invalid')
  })

  it('should return 500 when Stripe throws a non-Error object', async () => {
    mockUpdate.mockRejectedValue('unexpected string error')

    const response = await callRoute({ subscription_id: 'sub_123' })
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Unknown error')
  })

  it('should return 500 when request body is invalid JSON', async () => {
    const { POST } = await import('../route')
    const request = new Request('http://localhost/api/stripe/reactivate-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'invalid json{{{',
    })

    const response = await POST(request as any)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBeDefined()
  })
})
