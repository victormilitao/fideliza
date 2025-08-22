/// <reference types="vitest" />
import api from '@/services/api'
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useMyBusiness } from '../useMyBusiness'
import { act } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuthStore } from '@/store/useAuthStore'
import { BUSINESS_OWNER } from '@/types/profile'

const createWrapper = () => {
  const queryClient = new QueryClient()
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

vi.mock('@/store/useAuthStore', () => ({
  useAuthStore: vi.fn(),
}))

vi.mock('@/services/api', () => ({
  default: {
    getMyBusiness: vi.fn(),
  },
}))

describe('useMyBusiness', () => {
  it('should return loading state initially when user is logged in', async () => {
    vi.mocked(useAuthStore).mockReturnValue({
      session: { user: { id: '123' } },
      profile: { role: BUSINESS_OWNER },
    })

    vi.mocked(api.getMyBusiness).mockResolvedValue({
      data: { name: 'Business 1' },
      error: null,
    })

    const { result } = renderHook(() => useMyBusiness(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.business).toEqual({ name: 'Business 1' })
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isError).toBe(false)
    })
  })

  it('should handle error when user is not logged in', async () => {
    vi.mocked(useAuthStore).mockReturnValue({
      session: null,
      profile: null,
    })

    const { result } = renderHook(() => useMyBusiness(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
      expect(result.current.business).toBeUndefined()
    })
  })

  it('should handle API errors', async () => {
    vi.mocked(useAuthStore).mockReturnValue({
      session: { user: { id: '123' } },
      profile: { role: BUSINESS_OWNER },
    })

    vi.mocked(api.getMyBusiness).mockRejectedValue(new Error('API Error'))

    const { result } = renderHook(() => useMyBusiness(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.business).toBeUndefined()
    })
  })

  it('should refetch data when refetch is called', async () => {
    vi.mocked(useAuthStore).mockReturnValue({
      session: { user: { id: '123' } },
      profile: { role: BUSINESS_OWNER },
    })

    vi.mocked(api.getMyBusiness).mockResolvedValue({
      data: { name: 'Business 1' },
      error: null,
    })

    const { result } = renderHook(() => useMyBusiness(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.business).toEqual({ name: 'Business 1' })
    })

    vi.mocked(api.getMyBusiness).mockResolvedValue({
      data: { name: 'Business 2' },
      error: null,
    })

    await act(() => {
      result.current.refetch()
    })

    await waitFor(() => {
      expect(result.current.business).toEqual({ name: 'Business 2' })
    })
  })
})
