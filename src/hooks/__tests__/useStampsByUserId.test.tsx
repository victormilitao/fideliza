/// <reference types="vitest" />
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import api from '@/services/api'
import { useStampsByUserId } from '../useStampsByUserId'
import { useMyBusiness } from '../useMyBusiness'
import { useMyActiveCampaigns } from '../useMyActiveCampaigns'

const createWrapper = () => {
  const queryClient = new QueryClient()
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

vi.mock('@/services/api', () => ({
  default: {
    getStampsByUserId: vi.fn(),
  },
}))

vi.mock('../useMyBusiness', () => ({
  useMyBusiness: vi.fn(),
}))

vi.mock('../useMyActiveCampaigns', () => ({
  useMyActiveCampaigns: vi.fn(),
}))

describe('useStampsByUserId', () => {
  beforeEach(() => {
    vi.mocked(useMyActiveCampaigns).mockReturnValue({
      campaigns: [{ id: '1' }],
      error: null,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    })
    vi.clearAllMocks()
  })

  it('should return stamps data when API call is successful', async () => {
    vi.mocked(useMyBusiness).mockReturnValue({
      business: { id: '1' },
      error: null,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    })
    vi.mocked(api.getStampsByUserId).mockResolvedValue({
      data: [{ id: '1', userId: '1', campaignId: '1' }],
      error: null,
    })

    const { result } = renderHook(() => useStampsByUserId('1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.data).toEqual([
        { id: '1', userId: '1', campaignId: '1' },
      ])
      expect(result.current.isError).toBe(false)
    })
  })

  it('should handle errors when API call fails', async () => {
    vi.mocked(useMyBusiness).mockReturnValue({
      business: { id: '1' },
      error: null,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    })

    vi.mocked(api.getStampsByUserId).mockRejectedValue(
      new Error('Error fetching stamps')
    )

    const { result } = renderHook(() => useStampsByUserId('1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.data).toBeUndefined()
    })
  })
})
