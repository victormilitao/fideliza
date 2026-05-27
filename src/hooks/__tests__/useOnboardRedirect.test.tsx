/// <reference types="vitest" />
import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { useOnboardRedirect } from '../useOnboardRedirect'

const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/',
}))

vi.mock('../useMyBusiness', () => ({
  useMyBusiness: vi.fn(),
}))

vi.mock('../useMyActiveCampaigns', () => ({
  useMyActiveCampaigns: vi.fn(),
}))

vi.mock('../useBusinessSubscription', () => ({
  useBusinessSubscription: vi.fn(),
}))

import { useMyBusiness } from '../useMyBusiness'
import { useMyActiveCampaigns } from '../useMyActiveCampaigns'
import { useBusinessSubscription } from '../useBusinessSubscription'

describe('useOnboardRedirect', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should redirect to create-store when no business exists', () => {
    vi.mocked(useMyBusiness).mockReturnValue({
      business: null,
      isLoading: false,
    } as any)
    vi.mocked(useMyActiveCampaigns).mockReturnValue({
      campaigns: undefined,
      isLoading: false,
    } as any)
    vi.mocked(useBusinessSubscription).mockReturnValue({
      subscription: null,
      isLoading: false,
    } as any)

    renderHook(() => useOnboardRedirect())

    expect(mockPush).toHaveBeenCalledWith('/store/create-store')
  })

  it('should redirect to payment when subscription is canceled', () => {
    vi.mocked(useMyBusiness).mockReturnValue({
      business: { id: 'b1' },
      isLoading: false,
    } as any)
    vi.mocked(useMyActiveCampaigns).mockReturnValue({
      campaigns: [{ id: 'c1' }],
      isLoading: false,
    } as any)
    vi.mocked(useBusinessSubscription).mockReturnValue({
      subscription: { subscription_status: 'canceled' },
      isLoading: false,
    } as any)

    renderHook(() => useOnboardRedirect())

    expect(mockPush).toHaveBeenCalledWith('/store/payment')
  })

  it('should NOT redirect to payment when subscription is pending_cancellation', () => {
    vi.mocked(useMyBusiness).mockReturnValue({
      business: { id: 'b1' },
      isLoading: false,
    } as any)
    vi.mocked(useMyActiveCampaigns).mockReturnValue({
      campaigns: [{ id: 'c1' }],
      isLoading: false,
    } as any)
    vi.mocked(useBusinessSubscription).mockReturnValue({
      subscription: { subscription_status: 'pending_cancellation', status: 'complete' },
      isLoading: false,
    } as any)

    renderHook(() => useOnboardRedirect())

    expect(mockPush).not.toHaveBeenCalledWith('/store/payment')
  })

  it('should not redirect when shouldRedirect is false', () => {
    vi.mocked(useMyBusiness).mockReturnValue({
      business: null,
      isLoading: false,
    } as any)
    vi.mocked(useMyActiveCampaigns).mockReturnValue({
      campaigns: undefined,
      isLoading: false,
    } as any)
    vi.mocked(useBusinessSubscription).mockReturnValue({
      subscription: { subscription_status: 'canceled' },
      isLoading: false,
    } as any)

    renderHook(() => useOnboardRedirect(false))

    expect(mockPush).not.toHaveBeenCalled()
  })

  it('should not redirect while loading', () => {
    vi.mocked(useMyBusiness).mockReturnValue({
      business: null,
      isLoading: true,
    } as any)
    vi.mocked(useMyActiveCampaigns).mockReturnValue({
      campaigns: undefined,
      isLoading: true,
    } as any)
    vi.mocked(useBusinessSubscription).mockReturnValue({
      subscription: null,
      isLoading: true,
    } as any)

    renderHook(() => useOnboardRedirect())

    expect(mockPush).not.toHaveBeenCalled()
  })

  it('should return isLoading true when any dependency is loading', () => {
    vi.mocked(useMyBusiness).mockReturnValue({
      business: null,
      isLoading: false,
    } as any)
    vi.mocked(useMyActiveCampaigns).mockReturnValue({
      campaigns: undefined,
      isLoading: false,
    } as any)
    vi.mocked(useBusinessSubscription).mockReturnValue({
      subscription: null,
      isLoading: true,
    } as any)

    const { result } = renderHook(() => useOnboardRedirect())

    expect(result.current.isLoading).toBe(true)
  })

  it('should return subscription and subscriptionLoading in result', () => {
    const mockSubscription = { subscription_status: 'active', status: 'complete' }
    vi.mocked(useMyBusiness).mockReturnValue({
      business: { id: 'b1' },
      isLoading: false,
    } as any)
    vi.mocked(useMyActiveCampaigns).mockReturnValue({
      campaigns: [{ id: 'c1' }],
      isLoading: false,
    } as any)
    vi.mocked(useBusinessSubscription).mockReturnValue({
      subscription: mockSubscription,
      isLoading: false,
    } as any)

    const { result } = renderHook(() => useOnboardRedirect())

    expect(result.current.subscription).toEqual(mockSubscription)
    expect(result.current.subscriptionLoading).toBe(false)
  })
})
