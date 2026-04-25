/// <reference types="vitest" />
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useToast } from '@/hooks/useToast'
import { useRouter } from 'next/navigation'
import { useResetPassword } from '../useResetPassword'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

vi.mock('@/hooks/useToast', () => ({
  useToast: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}))

describe('useResetPassword', () => {
  const mockToast = { error: vi.fn(), success: vi.fn(), show: vi.fn() }
  const mockPush = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.restoreAllMocks()
    vi.mocked(useToast).mockReturnValue(mockToast)
    vi.mocked(useRouter).mockReturnValue({
      push: mockPush,
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    } as unknown as ReturnType<typeof useRouter>)
  })

  it('should navigate to /login and show success toast on successful password update', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    } as Response)

    const { result } = renderHook(() => useResetPassword(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      result.current.updatePassword({ password: 'newPassword123', token: 'valid-token' })
    })

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledWith('/api/auth/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: 'newPassword123', token: 'valid-token' }),
      })
      expect(mockToast.success).toHaveBeenCalledWith('Senha atualizada com sucesso!')
      expect(mockPush).toHaveBeenCalledWith('/login')
    })
  })

  it('should show error toast when API returns an error response', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Token expirado' }),
    } as Response)

    const { result } = renderHook(() => useResetPassword(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      result.current.updatePassword({ password: 'newPassword123', token: 'expired-token' })
    })

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Token expirado')
      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  it('should show fallback error message when API error has no message', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({}),
    } as Response)

    const { result } = renderHook(() => useResetPassword(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      result.current.updatePassword({ password: 'newPassword123', token: 'bad-token' })
    })

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Erro ao atualizar a senha. Tente novamente.')
      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  it('should show generic error toast on network failure', async () => {
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useResetPassword(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      result.current.updatePassword({ password: 'newPassword123', token: 'valid-token' })
    })

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith('Network error')
      expect(mockPush).not.toHaveBeenCalled()
    })
  })

  it('should set loading to true while mutation is pending', async () => {
    let resolvePromise: (value: unknown) => void
    vi.spyOn(global, 'fetch').mockImplementation(() =>
      new Promise((resolve) => {
        resolvePromise = resolve
      })
    )

    const { result } = renderHook(() => useResetPassword(), {
      wrapper: createWrapper(),
    })

    expect(result.current.loading).toBe(false)

    act(() => {
      result.current.updatePassword({ password: 'newPassword123', token: 'valid-token' })
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(true)
    })

    await act(async () => {
      resolvePromise!({
        ok: true,
        json: async () => ({ success: true }),
      })
    })

    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })
  })
})
