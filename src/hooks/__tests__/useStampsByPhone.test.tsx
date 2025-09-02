/// <reference types="vitest" />
import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { useStampsByPhone } from '../useStampsByPhone'

// Mock the dependencies
vi.mock('@/hooks/useUserByPhone', () => ({
  useUserByPhone: () => ({
    getUserByPhone: vi.fn(),
  }),
}))

vi.mock('@/hooks/useStampsByUserId', () => ({
  useStampsByUserId: () => ({
    data: null,
  }),
}))

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}))

describe('useStampsByPhone', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return getStampsByPhone function', () => {
    const { result } = renderHook(() => useStampsByPhone())
    
    expect(result.current.getStampsByPhone).toBeDefined()
    expect(typeof result.current.getStampsByPhone).toBe('function')
  })

  it('should return stamps state', () => {
    const { result } = renderHook(() => useStampsByPhone())
    
    expect(result.current.stamps).toBeDefined()
  })
})
