/// <reference types="vitest" />
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAddStamp } from '../useAddStamp'
import { useToast } from '@/hooks/useToast'
import { useMyBusiness } from '../useMyBusiness'
import api from '@/services/api'

const createWrapper = () => {
  const queryClient = new QueryClient()
  return ({ children }: { children: React.ReactNode }) => (
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </MemoryRouter>
  )
}

vi.mock('@/hooks/useToast', () => ({
  useToast: vi.fn(),
}))

vi.mock('../useMyBusiness', () => ({
  useMyBusiness: vi.fn(),
}))

vi.mock('@/services/api', () => ({
  default: {
    addStamp: vi.fn(),
  },
}))

describe('useAddStamp', () => {
  const mockToast = { error: vi.fn(), success: vi.fn(), show: vi.fn() }

  beforeEach(() => {
    vi.mocked(useToast).mockReturnValue(mockToast)
    vi.mocked(useMyBusiness).mockReturnValue({
      business: { id: '1' },
      error: null,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    })
    vi.clearAllMocks()
  })

  it('should successfully add a stamp', async () => {
    vi.mocked(api.addStamp).mockResolvedValue(undefined)

    const { result } = renderHook(() => useAddStamp(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      result.current.addStamp({ userId: '123' })
    })

    await waitFor(() => {
      expect(api.addStamp).toHaveBeenCalledWith({ userId: '123', businessId: '1' })
    })
  })

  it('should handle errors when adding a stamp fails', async () => {
    vi.mocked(api.addStamp).mockRejectedValue(new Error('Failed to add stamp'))

    const { result } = renderHook(() => useAddStamp(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      result.current.addStamp({ userId: '123' })
    })

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Failed to add stamp')
    })
  })
})
