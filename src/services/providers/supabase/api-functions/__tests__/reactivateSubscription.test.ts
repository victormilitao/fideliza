/// <reference types="vitest" />
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { reactivateSubscription } from '../reactivateSubscription'

describe('reactivateSubscription', () => {
  const originalFetch = globalThis.fetch

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  it('should return success data when API responds with 200', async () => {
    const mockResponse = {
      success: true,
      subscription: { id: 'sub_123', cancel_at_period_end: false },
    }

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    })

    const result = await reactivateSubscription('sub_123')

    expect(result.data).toEqual(mockResponse)
    expect(result.error).toBeNull()
    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/api/stripe/reactivate-subscription',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription_id: 'sub_123' }),
      }
    )
  })

  it('should return error when API responds with non-ok status', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Subscription not found' }),
    })

    const result = await reactivateSubscription('sub_invalid')

    expect(result.data).toBeNull()
    expect(result.error).toBeInstanceOf(Error)
    expect(result.error?.message).toBe('Subscription not found')
  })

  it('should return error when fetch throws a network error', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network error'))

    const result = await reactivateSubscription('sub_123')

    expect(result.data).toBeNull()
    expect(result.error).toBeInstanceOf(Error)
    expect(result.error?.message).toBe('Network error')
  })

  it('should return error when response is not valid JSON', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.reject(new Error('Invalid JSON')),
    })

    const result = await reactivateSubscription('sub_123')

    expect(result.data).toBeNull()
    expect(result.error).toBeInstanceOf(Error)
  })

  it('should pass the subscription ID correctly in the request body', async () => {
    const testSubId = 'sub_test_1TAzQ1DypeQ6bJI16knPKj1u'

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    })

    await reactivateSubscription(testSubId)

    const fetchCall = vi.mocked(globalThis.fetch).mock.calls[0]
    const body = JSON.parse(fetchCall[1]?.body as string)
    expect(body.subscription_id).toBe(testSubId)
  })

  it('should handle server error with generic error message', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: 'Internal Server Error' }),
    })

    const result = await reactivateSubscription('sub_123')

    expect(result.data).toBeNull()
    expect(result.error?.message).toBe('Internal Server Error')
  })
})
