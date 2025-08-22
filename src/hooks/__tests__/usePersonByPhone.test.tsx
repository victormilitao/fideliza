/// <reference types="vitest" />
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { usePersonByPhone } from '../usePersonByPhone'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import api from '@/services/api'
import { Person } from '@/types/person.type'
import { act } from 'react'

const createWrapper = () => {
  const queryClient = new QueryClient()
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

vi.mock('@/services/api', () => ({
  default: {
    getPersonByPhone: vi.fn(),
  },
}))

describe('usePersonByPhone', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should fetch person successfully', async () => {
    const mockPerson: Person = {
      id: 'person-1',
      phone: '11999999999',
      user_id: 'user-1',
    }

    vi.mocked(api.getPersonByPhone).mockResolvedValue({
      data: mockPerson,
      error: null,
    })

    const { result } = renderHook(() => usePersonByPhone('11999999999'), {
      wrapper: createWrapper(),
    })

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.person).toEqual(mockPerson)
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isError).toBe(false)
    })
  })

  it('should handle error when person not found', async () => {
    vi.mocked(api.getPersonByPhone).mockResolvedValue({
      data: null,
      error: new Error('Person not found'),
    })

    const { result } = renderHook(() => usePersonByPhone('11999999999'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.person).toBeUndefined()
    })
  })

  it('should not fetch person if phone is not provided', async () => {
    const { result } = renderHook(() => usePersonByPhone(''), {
      wrapper: createWrapper(),
    })

    expect(result.current.person).toBeUndefined()
    expect(result.current.isLoading).toBe(false)
  })

  it('should refetch person when refetch is called', async () => {
    const mockPerson: Person = {
      id: 'person-1',
      phone: '11999999999',
      user_id: 'user-1',
    }

    vi.mocked(api.getPersonByPhone).mockResolvedValue({
      data: mockPerson,
      error: null,
    })

    const { result } = renderHook(() => usePersonByPhone('11999999999'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.person).toEqual(mockPerson)
    })

    await act(async () => {
      await result.current.refetch()
    })

    expect(api.getPersonByPhone).toHaveBeenCalledTimes(2)
  })

  it('should handle person without id', async () => {
    const mockPerson = {
      phone: '11999999999',
      user_id: 'user-1',
    }

    vi.mocked(api.getPersonByPhone).mockResolvedValue({
      data: mockPerson,
      error: null,
    })

    const { result } = renderHook(() => usePersonByPhone('11999999999'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.person).toBeUndefined()
    })
  })
})
