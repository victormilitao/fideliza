/// <reference types="vitest" />
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { useBusinessCardsByPerson } from '../useBusinessCardsByPerson'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import api from '@/services/api'
import { Business } from '@/types/business.type'
import { act } from 'react'

const createWrapper = () => {
  const queryClient = new QueryClient()
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

vi.mock('@/services/api', () => ({
  default: {
    getBusinessCardsByPersonId: vi.fn(),
  },
}))

describe('useBusinessCardsByPerson', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch business cards successfully', async () => {
    const mockBusinesses: Business[] = [
      {
        id: 'business-1',
        name: 'Test Business',
        cnpj: '12345678901234',
        address: 'Test Address',
      },
    ]

    vi.mocked(api.getBusinessCardsByPersonId).mockResolvedValue({
      data: mockBusinesses,
      error: null,
    })

    const { result } = renderHook(() => useBusinessCardsByPerson('person-1'), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.data).toEqual(mockBusinesses)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isError).toBe(false)
    })
  })

  it('should handle error when fetching business cards fails', async () => {
    vi.mocked(api.getBusinessCardsByPersonId).mockRejectedValue(new Error('API Error'))

    const { result } = renderHook(() => useBusinessCardsByPerson('person-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.data).toBeUndefined()
    })
  })

  it('should not fetch business cards if personId is not provided', async () => {
    const { result } = renderHook(() => useBusinessCardsByPerson(undefined), {
      wrapper: createWrapper(),
    })

    expect(result.current.data).toBeUndefined()
    expect(result.current.isLoading).toBe(false)
  })

  it('should refetch business cards when refetch is called', async () => {
    const mockBusinesses: Business[] = [
      {
        id: 'business-1',
        name: 'Test Business',
        cnpj: '12345678901234',
        address: 'Test Address',
      },
    ]

    vi.mocked(api.getBusinessCardsByPersonId).mockResolvedValue({
      data: mockBusinesses,
      error: null,
    })

    const { result } = renderHook(() => useBusinessCardsByPerson('person-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.data).toEqual(mockBusinesses)
    })

    await act(async () => {
      await result.current.refetch()
    })

    expect(api.getBusinessCardsByPersonId).toHaveBeenCalledTimes(2)
  })
})
