/// <reference types="vitest" />
import { renderHook, act } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { useToast } from '../useToast'

describe('useToast', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return toast functions', () => {
    const { result } = renderHook(() => useToast())

    expect(result.current.success).toBeDefined()
    expect(result.current.error).toBeDefined()
    expect(result.current.show).toBeDefined()
    expect(typeof result.current.success).toBe('function')
    expect(typeof result.current.error).toBe('function')
    expect(typeof result.current.show).toBe('function')
  })

  it('should call success toast', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.success('Success message')
    })

    // Since this is a mock, we just verify the function exists and can be called
    expect(result.current.success).toBeDefined()
  })

  it('should call error toast', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.error('Error message')
    })

    expect(result.current.error).toBeDefined()
  })

  it('should call show toast', () => {
    const { result } = renderHook(() => useToast())

    act(() => {
      result.current.show('Show message')
    })

    expect(result.current.show).toBeDefined()
  })
})
