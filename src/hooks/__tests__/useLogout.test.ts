import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useLogout } from '../useLogout'
import { useAuthStore } from '@/store/useAuthStore'
import { useRouter } from 'next/navigation'
import { QueryClient, useQueryClient } from '@tanstack/react-query'

vi.mock('@/store/useAuthStore', () => ({
  useAuthStore: vi.fn(),
}))

vi.mock('@/services/providers/supabase/config', () => ({
  default: {},
}))

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}))

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: vi.fn(),
}))

describe('useLogout', () => {
  it('should clear session, clear query cache, and navigate to /login', async () => {
    const clearSessionMock = vi.fn()
    const pushMock = vi.fn()
    const clearQueryClientMock = vi.fn()

    vi.mocked(useAuthStore).mockReturnValue({ 
      session: null,
      isLoggedIn: false,
      profile: null,
      setSession: vi.fn(),
      clearSession: clearSessionMock 
    })
    vi.mocked(useRouter).mockReturnValue({
      push: pushMock,
      replace: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      prefetch: vi.fn(),
    } as unknown as ReturnType<typeof useRouter>)
    vi.mocked(useQueryClient).mockReturnValue({
      clear: clearQueryClientMock,
    } as unknown as QueryClient)
    
    const { result } = renderHook(() => useLogout())

    await result.current.logout()

    expect(clearQueryClientMock).toHaveBeenCalled()
    expect(clearSessionMock).toHaveBeenCalled()
  })
})
