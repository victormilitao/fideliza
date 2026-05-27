/// <reference types="vitest" />
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useLastCampaign } from '../useLastCampaign'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import api from '@/services/api'
import { Campaign } from '@/types/campaign.type'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

vi.mock('@/services/api', () => ({
  default: {
    getMyActiveCampaigns: vi.fn(),
  },
}))

describe('useLastCampaign', () => {
  it('should return the most recent campaign sorted by created_at', async () => {
    const mockData: Campaign[] = [
      { id: '1', created_at: '2025-01-01T00:00:00Z', rule: 'old rule', prize: 'old prize', stamps_required: 5 },
      { id: '2', created_at: '2025-06-01T00:00:00Z', rule: 'new rule', prize: 'new prize', stamps_required: 10 },
      { id: '3', created_at: '2025-03-01T00:00:00Z', rule: 'mid rule', prize: 'mid prize', stamps_required: 7 },
    ]
    vi.mocked(api.getMyActiveCampaigns).mockResolvedValue({ data: mockData, error: null })

    const { result } = renderHook(() => useLastCampaign('business-123'), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.lastCampaign?.id).toBe('2')
      expect(result.current.lastCampaign?.rule).toBe('new rule')
      expect(result.current.isLoading).toBe(false)
    })
  })

  it('should return null when no campaigns exist', async () => {
    vi.mocked(api.getMyActiveCampaigns).mockResolvedValue({ data: [], error: null })

    const { result } = renderHook(() => useLastCampaign('business-123'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.lastCampaign).toBeNull()
      expect(result.current.isLoading).toBe(false)
    })
  })

  it('should return null when data is null', async () => {
    vi.mocked(api.getMyActiveCampaigns).mockResolvedValue({ data: null, error: null })

    const { result } = renderHook(() => useLastCampaign('business-123'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.lastCampaign).toBeNull()
      expect(result.current.isLoading).toBe(false)
    })
  })

  it('should not fetch when businessId is undefined', async () => {
    const { result } = renderHook(() => useLastCampaign(undefined), {
      wrapper: createWrapper(),
    })

    expect(result.current.lastCampaign).toBeUndefined()
    expect(result.current.isLoading).toBe(false)
  })

  it('should handle API error', async () => {
    vi.mocked(api.getMyActiveCampaigns).mockRejectedValue(new Error('API Error'))

    const { result } = renderHook(() => useLastCampaign('business-123'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })
  })

  it('should return single campaign when only one exists', async () => {
    const mockData: Campaign[] = [
      { id: '1', created_at: '2025-01-01T00:00:00Z', rule: 'only rule', prize: 'only prize', stamps_required: 3 },
    ]
    vi.mocked(api.getMyActiveCampaigns).mockResolvedValue({ data: mockData, error: null })

    const { result } = renderHook(() => useLastCampaign('business-123'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.lastCampaign?.id).toBe('1')
      expect(result.current.lastCampaign?.rule).toBe('only rule')
    })
  })

  it('should handle campaigns without created_at by sorting them to the end', async () => {
    const mockData: Campaign[] = [
      { id: '1', rule: 'no date', prize: 'no date prize', stamps_required: 5 },
      { id: '2', created_at: '2025-06-01T00:00:00Z', rule: 'with date', prize: 'with date prize', stamps_required: 10 },
    ]
    vi.mocked(api.getMyActiveCampaigns).mockResolvedValue({ data: mockData, error: null })

    const { result } = renderHook(() => useLastCampaign('business-123'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.lastCampaign?.id).toBe('2')
    })
  })
})
