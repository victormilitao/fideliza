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
    getUserByPhone: vi.fn(),
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
    vi.clearAllMocks()
  })

  it('should successfully add a stamp with user existing', async () => {
    const userId = '123'
    const phone = '321'
    const businessId = '1'

    vi.mocked(api.addStamp).mockResolvedValue(undefined)
    vi.mocked(api.getUserByPhone).mockResolvedValue({
      data: { user_id: userId },
      error: null,
    })

    const { result } = renderHook(() => useAddStamp(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      result.current.addStamp({ stamp: { userId } })
    })

    await waitFor(() => {
      expect(api.getUserByPhone).not.toHaveBeenCalledWith(phone)
      expect(api.addStamp).toHaveBeenCalledWith({
        userId,
        businessId,
      })
    })
  })

  it('should handle errors when adding a stamp fails', async () => {
    vi.mocked(api.addStamp).mockRejectedValue(new Error('Failed to add stamp'))
    vi.mocked(api.getUserByPhone).mockResolvedValue({
      data: { user_id: '123' },
      error: null,
    })

    const { result } = renderHook(() => useAddStamp(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      result.current.addStamp({ stamp: { userId: '123' }, phone: '321' })
    })

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Failed to add stamp')
    })
  })

  it('should sign up the user and add a stamp when user does not exist', async () => {
    const userId = '456'
    const phone = '321'

    vi.mocked(api.getUserByPhone).mockResolvedValue({
      data: null,
      error: null,
    })
    vi.mocked(api.addStamp).mockResolvedValue(undefined)
    vi.mocked(api.signUp).mockResolvedValue({
      data: { id: userId },
      error: null,
    })

    const { result } = renderHook(() => useAddStamp(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      result.current.addStamp({ stamp: {}, phone })
    })

    await waitFor(() => {
      expect(api.getUserByPhone).toHaveBeenCalledWith(phone)
      expect(api.signUp).toHaveBeenCalledWith(phone)
      expect(api.addStamp).toHaveBeenCalledWith({
        userId: '456',
        businessId: '1',
      })
    })
  })

  it('should navigate to tickets page after successfully adding a stamp', async () => {
    const userId = '123'
    const phone = '321'

    vi.mocked(api.addStamp).mockResolvedValue(undefined)
    vi.mocked(api.getUserByPhone).mockResolvedValue({
      data: { user_id: userId },
      error: null,
    })

    const { result } = renderHook(() => useAddStamp(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      result.current.addStamp({ stamp: { userId }, phone })
    })

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/estabelecimento/tickets', {
        state: { params: userId },
      })
    })
  })

  it('should handle errors when fetching user by phone fails', async () => {
    vi.mocked(api.getUserByPhone).mockRejectedValue(new Error('Fetch failed'))

    const { result } = renderHook(() => useAddStamp(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      result.current.addStamp({ phone: '321' })
    })

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Fetch failed')
    })
  })

  it('should handle errors when adding a stamp fails', async () => {
    vi.mocked(api.addStamp).mockRejectedValue(
      new Error('Add stamp - Failed to add stamp')
    )

    const { result } = renderHook(() => useAddStamp(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      result.current.addStamp({ stamp: { userId: '123' } })
    })

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith(
        'Add stamp - Failed to add stamp'
      )
    })
  })
})
