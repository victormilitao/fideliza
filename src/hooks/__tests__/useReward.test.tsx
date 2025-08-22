/// <reference types="vitest" />
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { useReward } from '../useReward'
import api from '@/services/api'
import { act } from 'react'

vi.mock('@/services/api', () => ({
  default: {
    reward: vi.fn(),
  },
}))

vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
  }),
}))

describe('useReward', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should reward successfully', async () => {
    vi.mocked(api.reward).mockResolvedValue({
      data: true,
      error: null,
    })

    const { result } = renderHook(() => useReward())

    await act(async () => {
      const response = await result.current.reward('card-1', 'CODE123')
      expect(response).toBe(true)
    })

    expect(api.reward).toHaveBeenCalledWith('card-1', 'CODE123')
  })

  it('should handle reward error', async () => {
    vi.mocked(api.reward).mockResolvedValue({
      data: null,
      error: new Error('Invalid code'),
    })

    const { result } = renderHook(() => useReward())

    await act(async () => {
      const response = await result.current.reward('card-1', 'INVALID')
      expect(response).toBeUndefined()
    })

    expect(api.reward).toHaveBeenCalledWith('card-1', 'INVALID')
  })

  it('should handle API error', async () => {
    vi.mocked(api.reward).mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useReward())

    await act(async () => {
      const response = await result.current.reward('card-1', 'CODE123')
      expect(response).toBeUndefined()
    })
  })
})
