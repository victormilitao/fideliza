/// <reference types="vitest" />
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import api from '@/services/api'
import { useUserLoggedIn } from '../useUserLoggedIn'

const createWrapper = () => {
  const queryClient = new QueryClient()
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

vi.mock('@/services/api', () => ({
  default: {
    getUserLoggedIn: vi.fn(),
  },
}))

describe('useUserLoggedIn', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return user data when API call is successful', async () => {
    vi.mocked(api.getUserLoggedIn).mockResolvedValue({
      data: { id: '1', email: 'test@example.com' },
      error: null,
    })

    const { result } = renderHook(() => useUserLoggedIn(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.user).toEqual({ id: '1', email: 'test@example.com' })
      expect(result.current.isError).toBe(false)
    })
  })

  it('should handle API errors', async () => {
    vi.mocked(api.getUserLoggedIn).mockResolvedValue({
      data: null,
      error: { message: 'Error fetching user', name: 'error' },
    })

    const { result } = renderHook(() => useUserLoggedIn(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.user).toBeUndefined()
    })
  })
})
