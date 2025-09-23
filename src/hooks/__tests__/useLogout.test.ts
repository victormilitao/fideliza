import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useLogout } from '../useLogout'
import { useAuthStore } from '@/store/useAuthStore'
import { useNavigate } from 'react-router-dom'
import { QueryClient, useQueryClient } from '@tanstack/react-query'

vi.mock('@/store/useAuthStore', () => ({
  useAuthStore: vi.fn(),
}))

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}))

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: vi.fn(),
}))

describe('useLogout', () => {
  it('should clear session, clear query cache, and navigate to /login', async () => {
    const clearSessionMock = vi.fn()
    const navigateMock = vi.fn()
    const clearQueryClientMock = vi.fn()

    vi.mocked(useAuthStore).mockReturnValue({ 
      session: null,
      isLoggedIn: false,
      profile: null,
      setSession: vi.fn(),
      clearSession: clearSessionMock 
    })
    vi.mocked(useNavigate).mockReturnValue(navigateMock)
    vi.mocked(useQueryClient).mockReturnValue({
      clear: clearQueryClientMock,
    } as unknown as QueryClient)
    
    const { result } = renderHook(() => useLogout())

    await result.current.logout()

    expect(clearQueryClientMock).toHaveBeenCalled()
    expect(clearSessionMock).toHaveBeenCalled()
  })
})
