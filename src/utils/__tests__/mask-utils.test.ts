import { describe, expect, it } from 'vitest'
import { getMaskConfig, maskMap } from '@/utils/mask-utils'

describe('getMaskConfig', () => {
  it('should return the correct mask config for phone', () => {
    expect(getMaskConfig('phone')).toEqual(maskMap.phone)
  })

  it('should return the correct mask config for cpf', () => {
    expect(getMaskConfig('cpf')).toEqual(maskMap.cpf)
  })

  it('should return the correct mask config for date', () => {
    expect(getMaskConfig('date')).toEqual(maskMap.date)
  })

  it('should return custom mask config when provided', () => {
    const custom = {
      mask: '**/**',
      replacement: { '*': /[a-z]/ },
    }
    expect(getMaskConfig(undefined, custom)).toEqual(custom)
  })

  it('should return undefined when no maskType or customMask is provided', () => {
    expect(getMaskConfig(undefined, undefined)).toBeUndefined()
  })
})
