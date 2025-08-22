/// <reference types="vitest" />
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSendStampByPhone } from '../useSendStampByPhone'
import { useToast } from '@/hooks/useToast'
import { useAddStamp } from '../useAddStamp'
import api from '@/services/api'

const createWrapper = () => {
  const queryClient = new QueryClient()
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

vi.mock('@/hooks/useToast', () => ({
  useToast: vi.fn(),
}))

vi.mock('../useAddStamp', () => ({
  useAddStamp: vi.fn(),
}))

vi.mock('@/services/api', () => ({
  default: {
    findOrCreatePerson: vi.fn(),
  },
}))

describe('useSendStampByPhone', () => {
  const mockToast = { error: vi.fn(), success: vi.fn(), show: vi.fn() }
  const mockAddStamp = vi.fn()
  const person = { id: '123', name: 'John Doe', phone: '123456789' }

  beforeEach(() => {
    vi.mocked(useToast).mockReturnValue(mockToast)
    vi.mocked(useAddStamp).mockReturnValue({
      addStamp: mockAddStamp,
      loading: false,
    })
    vi.mocked(api.findOrCreatePerson).mockResolvedValue({
      data: person,
      error: null,
    })
    vi.clearAllMocks()
  })

  it('should successfully send a stamp', async () => {
    mockAddStamp.mockResolvedValue(undefined)

    const { result } = renderHook(() => useSendStampByPhone(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.sendStamp('123456789')
    })

    await waitFor(() => {
      expect(mockAddStamp).toHaveBeenCalledWith({ personId: person.id })
      expect(mockToast.success).toHaveBeenCalledWith('Selo enviado.')
    })
  })

  it('should call onSuccess callback when stamp is sent successfully', async () => {
    mockAddStamp.mockResolvedValue(undefined)
    const onSuccessMock = vi.fn()

    const { result } = renderHook(() => useSendStampByPhone(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.sendStamp('123456789', onSuccessMock)
    })

    await waitFor(() => {
      expect(mockAddStamp).toHaveBeenCalledWith({ personId: person.id })
      expect(mockToast.success).toHaveBeenCalledWith('Selo enviado.')
      expect(onSuccessMock).toHaveBeenCalled()
    })
  })

  it('should handle errors when person not exists', async () => {
    const mockApiResponse = { data: null, error: new Error() }
    vi.mocked(api.findOrCreatePerson).mockResolvedValue(mockApiResponse)

    const { result } = renderHook(() => useSendStampByPhone(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.sendStamp('123456789')
    })

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith(
        'Erro ao encontrar ou criar a pessoa.'
      )
    })
  })
})
