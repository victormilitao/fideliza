/// <reference types="vitest" />
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { useToast } from '@/hooks/useToast'
import { useNavigate } from 'react-router-dom'
import api from '@/services/api'
import { useAuth } from '../useAuth'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Credentials } from '@/services/types/auth.type'
import { BUSINESS_OWNER } from '@/types/profile'

const createWrapper = () => {
  const queryClient = new QueryClient()
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

vi.mock('@/hooks/useToast', () => ({
  useToast: vi.fn(),
}))

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}))

vi.mock('@/services/api', () => ({
  default: {
    signInWithPassword: vi.fn(),
    getProfile: vi.fn(),
  },
}))

describe('useAuth', () => {
  const mockToast = { error: vi.fn(), success: vi.fn(), show: vi.fn() }
  const mockNavigate = vi.fn()

  beforeEach(() => {
    vi.mocked(useToast).mockReturnValue(mockToast)
    vi.mocked(useNavigate).mockReturnValue(mockNavigate)
    vi.clearAllMocks()
  })

  it('should navigate on successful login', async () => {
    vi.mocked(api.signInWithPassword as Mock).mockResolvedValue({
      data: { user: { id: 1, email: 'test@example.com' } },
      error: null,
    })

    vi.mocked(api.getProfile as Mock).mockResolvedValue({
      data: { profile: { role: BUSINESS_OWNER } },
      error: null,
    })

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    const credentials: Credentials = {
      email: 'test@example.com',
      password: 'password123',
    }
    await act(async () => {
      result.current.login(credentials)
    })

    await waitFor(() => {
      expect(api.signInWithPassword).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
      expect(mockNavigate).toHaveBeenCalledWith('/')
      expect(result.current.loading).toBe(false)
    })
  })

  it('should show toast on invalid credentials', async () => {
    ;(api.signInWithPassword as Mock).mockResolvedValue({
      data: null,
      error: 'Invalid credentials',
    })

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    const credentials: Credentials = {
      email: 'test@example.com',
      password: 'wrongpassword',
    }
    await act(async () => {
      result.current.login(credentials)
    })

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith(
        'E-mail ou senha incorretos.'
      )
      expect(mockNavigate).not.toHaveBeenCalled()
      expect(result.current.loading).toBe(false)
    })
  })

  it('should show toast on unexpected error', async () => {
    ;(api.signInWithPassword as Mock).mockRejectedValue({ status: 500 })

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    const credentials: Credentials = {
      email: 'test@example.com',
      password: 'anyPassword',
    }
    await act(async () => {
      result.current.login(credentials)
    })

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith(
        'Ocorreu um erro inesperado. Tente novamente.'
      )
      expect(mockNavigate).not.toHaveBeenCalled()
      expect(result.current.loading).toBe(false)
    })
  })
})
