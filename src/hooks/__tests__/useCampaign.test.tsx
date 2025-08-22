/// <reference types="vitest" />
import { renderHook, waitFor } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { useCampaign } from '../useCampaign'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import api from '@/services/api'
import { Campaign } from '@/types/campaign.type'
import { act } from 'react'

const createWrapper = () => {
  const queryClient = new QueryClient()
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

vi.mock('@/services/api', () => ({
  default: {
    createCampaign: vi.fn(),
  },
}))

vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({
    success: vi.fn(),
    error: vi.fn(),
  }),
}))

describe('useCampaign', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create campaign successfully', async () => {
    const mockCampaign: Campaign = {
      id: '1',
      business_id: 'business-1',
      rule: 'Colete 10 selos',
      prize: 'Café grátis',
      stamps_required: 10,
    }

    vi.mocked(api.createCampaign).mockResolvedValue({
      data: mockCampaign,
      error: null,
    })

    const { result } = renderHook(() => useCampaign(), {
      wrapper: createWrapper(),
    })

    const campaignData = {
      business_id: 'business-1',
      rule: 'Colete 10 selos',
      prize: 'Café grátis',
      stamps_required: 10,
    }

    await act(async () => {
      const response = await result.current.createCampaign(campaignData)
      expect(response).toEqual(mockCampaign)
    })

    expect(api.createCampaign).toHaveBeenCalledWith(campaignData)
  })

  it('should handle error when creating campaign fails', async () => {
    vi.mocked(api.createCampaign).mockResolvedValue({
      data: null,
      error: new Error('Database error'),
    })

    const { result } = renderHook(() => useCampaign(), {
      wrapper: createWrapper(),
    })

    const campaignData = {
      business_id: 'business-1',
      rule: 'Colete 10 selos',
      prize: 'Café grátis',
      stamps_required: 10,
    }

    await act(async () => {
      try {
        await result.current.createCampaign(campaignData)
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).message).toBe('Erro ao criar campanha.')
      }
    })
  })

  it('should handle unexpected error', async () => {
    vi.mocked(api.createCampaign).mockRejectedValue(new Error('Network error'))

    const { result } = renderHook(() => useCampaign(), {
      wrapper: createWrapper(),
    })

    const campaignData = {
      business_id: 'business-1',
      rule: 'Colete 10 selos',
      prize: 'Café grátis',
      stamps_required: 10,
    }

    await act(async () => {
      try {
        await result.current.createCampaign(campaignData)
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect((error as Error).message).toBe('Network error')
      }
    })
  })

  it('should return loading state', () => {
    const { result } = renderHook(() => useCampaign(), {
      wrapper: createWrapper(),
    })

    expect(result.current.createCampaignLoading).toBe(false)
  })
})
