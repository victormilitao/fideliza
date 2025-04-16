/// <reference types="vitest" />
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import api from '@/services/api'
import { useUserLoggedIn } from '../useUserLoggedIn'
import { useProfile } from '../user/useProfile'

const createWrapper = () => {
  const queryClient = new QueryClient()
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

vi.mock('@/services/api', () => ({
  default: {
    getProfile: vi.fn(),
  },
}))

vi.mock('../useUserLoggedIn', () => ({
  useUserLoggedIn: vi.fn(),
}))

describe('useProfile', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return profile data when API call is successful', async () => {
    vi.mocked(useUserLoggedIn).mockReturnValue({
      user: { id: '123' },
      error: null,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    })

    vi.mocked(api.getProfile).mockResolvedValue({
      data: { id: '123', role: 'customer', user_id: '123' },
      error: null,
    })

    const { result } = renderHook(() => useProfile(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.profile).toEqual({
        id: '123',
        role: 'customer',
        user_id: '123',
      })
      expect(result.current.isError).toBe(false)
    })
  })

  it('should handle error when API call fails', async () => {
    vi.mocked(useUserLoggedIn).mockReturnValue({
      user: { id: '123' },
      error: null,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    })

    vi.mocked(api.getProfile).mockRejectedValue(new Error('API Error'))

    const { result } = renderHook(() => useProfile(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.profile).toBeUndefined()
    })
  })

  it('should handle case when user is not logged in', async () => {
    vi.mocked(useUserLoggedIn).mockReturnValue({
      user: null,
      error: null,
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
    })

    const { result } = renderHook(() => useProfile(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.profile).toBeUndefined()
      expect(result.current.isError).toBe(false)
    })
  })
})