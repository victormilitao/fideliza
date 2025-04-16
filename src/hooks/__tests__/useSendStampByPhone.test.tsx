/// <reference types="vitest" />
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSendStampByPhone } from '../useSendStampByPhone'
import { useToast } from '@/hooks/useToast'
import { useUserByPhone } from '../useUserByPhone'
import { useAddStamp } from '../useAddStamp'

const createWrapper = () => {
  const queryClient = new QueryClient()
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

vi.mock('@/hooks/useToast', () => ({
  useToast: vi.fn(),
}))

vi.mock('../useUserByPhone', () => ({
  useUserByPhone: vi.fn(),
}))

vi.mock('../useAddStamp', () => ({
  useAddStamp: vi.fn(),
}))

describe('useSendStampByPhone', () => {
  const mockToast = { error: vi.fn(), success: vi.fn(), show: vi.fn() }
  const mockGetUserByPhone = vi.fn()
  const mockAddStamp = vi.fn()

  beforeEach(() => {
    vi.mocked(useToast).mockReturnValue(mockToast)
    vi.mocked(useUserByPhone).mockReturnValue({
      getUserByPhone: mockGetUserByPhone,
      isError: false,
      isPending: false,
      error: null,
    })
    vi.mocked(useAddStamp).mockReturnValue({
      addStamp: mockAddStamp,
      loading: false,
    })
    vi.clearAllMocks()
  })

  it('should successfully send a stamp', async () => {
    mockGetUserByPhone.mockResolvedValue({ data: { user_id: '123' } })
    mockAddStamp.mockResolvedValue(undefined)

    const { result } = renderHook(() => useSendStampByPhone(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.sendStamp('123456789')
    })

    await waitFor(() => {
      expect(mockGetUserByPhone).toHaveBeenCalledWith('123456789')
      expect(mockAddStamp).toHaveBeenCalledWith({ userId: '123' })
      expect(mockToast.success).toHaveBeenCalledWith('Selo enviado.')
    })
  })

  it('should show error toast when user is not found', async () => {
    mockGetUserByPhone.mockResolvedValue({ data: null })

    const { result } = renderHook(() => useSendStampByPhone(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.sendStamp('123456789')
    })

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Usuário não encontrado.')
    })
  })

  it('should handle errors when adding a stamp fails', async () => {
    mockGetUserByPhone.mockResolvedValue({ data: { user_id: '123' } })
    mockAddStamp.mockRejectedValue(new Error('Failed to add stamp'))

    const { result } = renderHook(() => useSendStampByPhone(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.sendStamp('123456789')
    })

    await waitFor(() => {
      expect(mockGetUserByPhone).toHaveBeenCalledWith('123456789')
      expect(mockAddStamp).toHaveBeenCalledWith({ userId: '123' })
      expect(mockToast.error).toHaveBeenCalledWith('Failed to add stamp')
    })
  })
})
