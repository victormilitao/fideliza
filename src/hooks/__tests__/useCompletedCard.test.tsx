/// <reference types="vitest" />
import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { useCompletedCard } from '../useCompletedCard'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import api from '@/services/api'
import { Card } from '@/types/card.type'
import { Person } from '@/types/person.type'
import { act } from 'react'

const createWrapper = () => {
  const queryClient = new QueryClient()
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

vi.mock('@/services/api', () => ({
  default: {
    getPersonByPhone: vi.fn(),
    findCompletedCard: vi.fn(),
  },
}))

vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({
    error: vi.fn(),
  }),
}))

vi.mock('@/hooks/useMyBusiness', () => ({
  useMyBusiness: () => ({
    business: { id: 'business-1' },
  }),
}))

vi.mock('@/hooks/useMyActiveCampaigns', () => ({
  useMyActiveCampaigns: () => ({
    campaigns: [{ id: 'campaign-1' }],
  }),
}))

describe('useCompletedCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should find completed card successfully', async () => {
    const mockPerson: Person = {
      id: 'person-1',
      phone: '11999999999',
      user_id: 'user-1',
    }

    const mockCard: Card = {
      id: 'card-1',
      person_id: 'person-1',
      stamps: [],
    }

    vi.mocked(api.getPersonByPhone).mockResolvedValue({
      data: mockPerson,
      error: null,
    })

    vi.mocked(api.findCompletedCard).mockResolvedValue({
      data: mockCard,
      error: null,
    })

    const { result } = renderHook(() => useCompletedCard(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      const card = await result.current.findCompletedCard('11999999999')
      expect(card).toEqual(mockCard)
    })

    expect(api.getPersonByPhone).toHaveBeenCalledWith('11999999999')
    expect(api.findCompletedCard).toHaveBeenCalledWith('person-1', ['campaign-1'])
  })

  it('should handle no active campaigns', async () => {
    vi.mocked(api.getPersonByPhone).mockResolvedValue({
      data: null,
      error: null,
    })

    const { result } = renderHook(() => useCompletedCard(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      const card = await result.current.findCompletedCard('11999999999')
      expect(card).toBeNull()
    })
  })

  it('should handle person not found', async () => {
    vi.mocked(api.getPersonByPhone).mockResolvedValue({
      data: null,
      error: new Error('Person not found'),
    })

    const { result } = renderHook(() => useCompletedCard(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      const card = await result.current.findCompletedCard('11999999999')
      expect(card).toBeNull()
    })
  })

  it('should handle completed card not found', async () => {
    const mockPerson: Person = {
      id: 'person-1',
      phone: '11999999999',
      user_id: 'user-1',
    }

    vi.mocked(api.getPersonByPhone).mockResolvedValue({
      data: mockPerson,
      error: null,
    })

    vi.mocked(api.findCompletedCard).mockResolvedValue({
      data: null,
      error: new Error('Card not found'),
    })

    const { result } = renderHook(() => useCompletedCard(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      const card = await result.current.findCompletedCard('11999999999')
      expect(card).toBeNull()
    })
  })

  it('should sanitize phone number', async () => {
    const mockPerson: Person = {
      id: 'person-1',
      phone: '11999999999',
      user_id: 'user-1',
    }

    const mockCard: Card = {
      id: 'card-1',
      person_id: 'person-1',
      stamps: [],
    }

    vi.mocked(api.getPersonByPhone).mockResolvedValue({
      data: mockPerson,
      error: null,
    })

    vi.mocked(api.findCompletedCard).mockResolvedValue({
      data: mockCard,
      error: null,
    })

    const { result } = renderHook(() => useCompletedCard(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      const card = await result.current.findCompletedCard('(11) 99999-9999')
      expect(card).toEqual(mockCard)
    })

    expect(api.getPersonByPhone).toHaveBeenCalledWith('11999999999')
  })
})
