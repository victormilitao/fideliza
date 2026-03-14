/// <reference types="vitest" />
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAddStamp } from '../useAddStamp'
import { useToast } from '@/hooks/useToast'
import { useMyBusiness } from '../useMyBusiness'
import api from '@/services/api'
import { useMyActiveCampaigns } from '../useMyActiveCampaigns'

const createWrapper = () => {
  const queryClient = new QueryClient()
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

vi.mock('@/hooks/useToast', () => ({
  useToast: vi.fn(),
}))

vi.mock('../useMyBusiness', () => ({
  useMyBusiness: vi.fn(),
}))

vi.mock('../useMyActiveCampaigns', () => ({
  useMyActiveCampaigns: vi.fn(),
}))

vi.mock('@/services/api', () => ({
  default: {
    addStamp: vi.fn(),
    getPersonByPhone: vi.fn(),
    signUp: vi.fn(),
  },
}))

const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
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
    vi.mocked(useMyActiveCampaigns).mockReturnValue({
      campaigns: [{ id: '1' }],
      error: null,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    })
    vi.clearAllMocks()
  })

  it('should handle errors when no campaigns active', async () => {
    vi.mocked(useMyActiveCampaigns).mockReturnValue({
      campaigns: [],
      error: null,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    })

    const { result } = renderHook(() => useAddStamp(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      try {
        await result.current.addStamp({ personId: '123' })
      } catch (error) {}
    })

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Nenhuma campanha ativa.')
    })
  })

  it('should handle errors when no response by api', async () => {
    vi.mocked(useMyActiveCampaigns).mockReturnValue({
      campaigns: [{ id: '1' }],
      error: null,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    })
    vi.mocked(api.addStamp).mockResolvedValue({
      data: null,
      error: new Error(),
    })

    const { result } = renderHook(() => useAddStamp(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      try {
        await result.current.addStamp({ personId: '123' })
      } catch (error) {}
    })

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Erro ao adicionar selo.')
    })
  })
})
