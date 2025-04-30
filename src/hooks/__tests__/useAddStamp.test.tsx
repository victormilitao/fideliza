/// <reference types="vitest" />
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAddStamp } from '../useAddStamp'
import { useToast } from '@/hooks/useToast'
import { useMyBusiness } from '../useMyBusiness'
import api from '@/services/api'
import { useMyActiveCampaigns } from '../useMyActiveCampaigns'

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

const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

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

  it('should navigate to tickets page after successfully adding a stamp', async () => {
    const personId = '123'
    const cardId = '1'
    const stamp = { id: '1', personId, cardId }

    vi.mocked(api.addStamp).mockResolvedValue({ data: stamp, error: null })
    vi.mocked(api.getPersonByPhone).mockResolvedValue({
      data: { id: '1' },
      error: null,
    })

    const { result } = renderHook(() => useAddStamp(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      result.current.addStamp({ personId })
    })

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/estabelecimento/tickets', {
        state: { params: personId },
      })
    })
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
    vi.mocked(api.addStamp).mockResolvedValue({ data: null, error: new Error() })

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
