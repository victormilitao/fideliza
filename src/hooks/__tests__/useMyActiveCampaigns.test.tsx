/// <reference types="vitest" />
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useMyActiveCampaigns } from '../useMyActiveCampaigns'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import api from '@/services/api'
import { Campaign } from '@/types/campaign.type'
import { act } from 'react'

const createWrapper = () => {
  const queryClient = new QueryClient()
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

vi.mock('@/services/api', () => ({
  default: {
    getMyActiveCampaigns: vi.fn(),
  },
}))

describe('useMyActiveCampaigns', () => {
  it('should fetch campaigns successfully', async () => {
    const mockData: Campaign[] = [{ id: '1' }]
    vi.mocked(api.getMyActiveCampaigns).mockResolvedValue({ data: mockData, error: null })

    const { result } = renderHook(() => useMyActiveCampaigns('123'), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.campaigns).toEqual(mockData)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isError).toBe(false)
    })
  })

  it('should handle error when fetching campaigns fails', async () => {
    vi.mocked(api.getMyActiveCampaigns).mockRejectedValue(new Error('API Error'))

    const { result } = renderHook(() => useMyActiveCampaigns('123'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.campaigns).toBeUndefined()
      expect(result.current.error?.message).toBeUndefined()
    })
  })

  it('should not fetch campaigns if businessId is not provided', async () => {
    const { result } = renderHook(() => useMyActiveCampaigns(''), {
      wrapper: createWrapper(),
    })

    expect(result.current.campaigns).toBeUndefined()
    expect(result.current.isLoading).toBe(false)
  })

  it('should refetch campaigns when refetch is called', async () => {
    const mockData1: Campaign[] = [{ id: '1' }]
    const mockData2: Campaign[] = [{ id: '2' }]
    vi.mocked(api.getMyActiveCampaigns).mockResolvedValueOnce({ data: mockData1, error: null })

    const { result } = renderHook(() => useMyActiveCampaigns('123'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.campaigns).toEqual(mockData1)
    })

    vi.mocked(api.getMyActiveCampaigns).mockResolvedValueOnce({ data: mockData2, error: null })

    await act(() => {
      result.current.refetch()
    })

    await waitFor(() => {
      expect(result.current.campaigns).toEqual(mockData2)
    })
  })
})
