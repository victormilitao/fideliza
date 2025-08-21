/// <reference types="vitest" />
import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useToast } from '@/hooks/useToast'
import api from '@/services/api'
import { useUserByPhone } from '../useUserByPhone'
import { Person } from '@/types/person.type'
import { Response } from '@/services/types/api.type'

const createWrapper = () => {
  const queryClient = new QueryClient()
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

vi.mock('@/hooks/useToast', () => ({
  useToast: vi.fn(),
}))

vi.mock('@/services/api', () => ({
  default: {
    getUserByPhone: vi.fn(),
    getPersonByPhoneWithProfile: vi.fn(),
  },
}))

describe('useUserByPhone', () => {
  const mockToast = { error: vi.fn(), success: vi.fn(), show: vi.fn() }

  beforeEach(() => {
    vi.mocked(useToast).mockReturnValue(mockToast)
    vi.clearAllMocks()
  })

  it('should return user data when phone is valid', async () => {
    vi.mocked(api.getPersonByPhoneWithProfile).mockResolvedValue({
      data: { id: '1' },
      error: null,
    })

    const { result } = renderHook(() => useUserByPhone(), {
      wrapper: createWrapper(),
    })

    let response: Response<Person> | undefined
    await act(async () => {
      response = await result.current.getUserByPhone('123456789')
    })

    await waitFor(() => {
      expect(response).toEqual({ data: { id: '1' }, error: null })
      expect(mockToast.error).not.toHaveBeenCalled()
      expect(result.current.isError).toBe(false)
    })
  })
})
