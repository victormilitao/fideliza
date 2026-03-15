/// <reference types="vitest" />
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import api from '@/services/api'
import { useTotalStamps } from '../useTotalStamps'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

vi.mock('@/services/api', () => ({
  default: {
    getTotalStampsByBusiness: vi.fn(),
  },
}))

describe('useTotalStamps', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return total stamps when API call is successful', async () => {
    vi.mocked(api.getTotalStampsByBusiness).mockResolvedValue({
      data: 25,
      error: null,
    })

    const { result } = renderHook(() => useTotalStamps('business-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.totalStamps).toBe(25)
      expect(result.current.isLoading).toBe(false)
    })

    expect(api.getTotalStampsByBusiness).toHaveBeenCalledWith('business-1')
  })

  it('should return 0 when businessId is undefined', async () => {
    const { result } = renderHook(() => useTotalStamps(undefined), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(api.getTotalStampsByBusiness).not.toHaveBeenCalled()
  })

  it('should return 0 when API returns null data', async () => {
    vi.mocked(api.getTotalStampsByBusiness).mockResolvedValue({
      data: null,
      error: null,
    })

    const { result } = renderHook(() => useTotalStamps('business-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.totalStamps).toBe(0)
    })
  })

  it('should handle API errors', async () => {
    vi.mocked(api.getTotalStampsByBusiness).mockResolvedValue({
      data: null,
      error: new Error('Database error'),
    })

    const { result } = renderHook(() => useTotalStamps('business-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.totalStamps).toBeUndefined()
    })
  })
})
