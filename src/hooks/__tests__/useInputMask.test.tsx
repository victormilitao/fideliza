/// <reference types="vitest" />
import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useInputMask } from '../useInputMask'
import { MaskType } from '@/utils/mask-utils'

describe('useInputMask', () => {
  it('should return a ref when maskType is provided', () => {
    const { result } = renderHook(() => useInputMask('phone'))

    expect(result.current).toBeDefined()
    expect(typeof result.current).toBe('object')
  })

  it('should return a ref when customMask is provided', () => {
    const customMask = {
      mask: '(00) 00000-0000',
      placeholder: '(__) _____-____',
    }

    const { result } = renderHook(() => useInputMask(undefined, customMask))

    expect(result.current).toBeDefined()
    expect(typeof result.current).toBe('object')
  })

  it('should return undefined when no mask is provided', () => {
    const { result } = renderHook(() => useInputMask())

    expect(result.current).toBeUndefined()
  })

  it('should work with different mask types', () => {
    const maskTypes: MaskType[] = ['phone', 'cnpj', 'cep']

    maskTypes.forEach((maskType) => {
      const { result } = renderHook(() => useInputMask(maskType))
      expect(result.current).toBeDefined()
    })
  })
})
