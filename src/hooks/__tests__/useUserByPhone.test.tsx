/// <reference types="vitest" />
import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useToast } from '@/hooks/useToast'
import api from '@/services/api'
import { useUserByPhone } from '../useUserByPhone'

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
  },
}))

describe('useUserByPhone', () => {
  const mockToast = { error: vi.fn(), success: vi.fn(), show: vi.fn() }

  beforeEach(() => {
    vi.mocked(useToast).mockReturnValue(mockToast)
    vi.clearAllMocks()
  })

  it('should return user data when phone is valid', async () => {
    vi.mocked(api.getUserByPhone).mockResolvedValue({
      data: { id: '1' },
      error: null,
    })

    const { result } = renderHook(() => useUserByPhone(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      const response = await result.current.getUserByPhone('123456789')
      expect(response.data).toEqual({ id: '1' })
      expect(mockToast.error).not.toHaveBeenCalled()
      expect(result.current.isError).toBe(false)
    })
  })

  it('should show error toast when API call fails', async () => {
    vi.mocked(api.getUserByPhone).mockResolvedValue({
      data: null,
      error: { message: 'User not found', name: 'error' },
    })

    const { result } = renderHook(() => useUserByPhone(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await expect(result.current.getUserByPhone('123456789')).rejects.toThrow('User not found')
    })

    expect(mockToast.error).toHaveBeenCalledWith('Usuário não encontrado.')
    expect(result.current.isError).toBe(true)
  })
})
