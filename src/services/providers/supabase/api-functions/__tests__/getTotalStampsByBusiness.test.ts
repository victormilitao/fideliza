/// <reference types="vitest" />
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getTotalStampsByBusiness } from '../getTotalStampsByBusiness'

const mockFrom = vi.fn()
const mockSelect = vi.fn()
const mockEq = vi.fn()

vi.mock('../../config', () => ({
  default: {
    from: (...args: unknown[]) => mockFrom(...args),
  },
}))

describe('getTotalStampsByBusiness', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockFrom.mockReturnValue({ select: mockSelect })
    mockSelect.mockReturnValue({ eq: mockEq })
  })

  it('should return stamp count for a business with campaigns', async () => {
    const mockCampaigns = [{ id: 'campaign-1' }, { id: 'campaign-2' }]

    mockEq.mockResolvedValue({
      data: mockCampaigns,
      error: null,
    })

    const mockStampsSelect = vi.fn()
    const mockStampsIn = vi.fn()

    mockFrom.mockReturnValueOnce({ select: mockSelect })
    mockFrom.mockReturnValueOnce({ select: mockStampsSelect })
    mockStampsSelect.mockReturnValue({ in: mockStampsIn })
    mockStampsIn.mockResolvedValue({
      count: 42,
      error: null,
    })

    const result = await getTotalStampsByBusiness('business-1')

    expect(result).toEqual({ data: 42, error: null })
    expect(mockFrom).toHaveBeenCalledWith('campaigns')
  })

  it('should return 0 when business has no campaigns', async () => {
    mockEq.mockResolvedValue({
      data: [],
      error: null,
    })

    const result = await getTotalStampsByBusiness('business-1')

    expect(result).toEqual({ data: 0, error: null })
  })

  it('should return error when campaign query fails', async () => {
    const mockError = new Error('Campaign query failed')

    mockEq.mockResolvedValue({
      data: null,
      error: mockError,
    })

    const result = await getTotalStampsByBusiness('business-1')

    expect(result).toEqual({ data: null, error: mockError })
  })

  it('should return error when stamp count query fails', async () => {
    const mockCampaigns = [{ id: 'campaign-1' }]

    mockEq.mockResolvedValue({
      data: mockCampaigns,
      error: null,
    })

    const mockStampsSelect = vi.fn()
    const mockStampsIn = vi.fn()
    const mockStampError = new Error('Stamp query failed')

    mockFrom.mockReturnValueOnce({ select: mockSelect })
    mockFrom.mockReturnValueOnce({ select: mockStampsSelect })
    mockStampsSelect.mockReturnValue({ in: mockStampsIn })
    mockStampsIn.mockResolvedValue({
      count: null,
      error: mockStampError,
    })

    const result = await getTotalStampsByBusiness('business-1')

    expect(result).toEqual({ data: null, error: mockStampError })
  })

  it('should return 0 when stamp count is null', async () => {
    const mockCampaigns = [{ id: 'campaign-1' }]

    mockEq.mockResolvedValue({
      data: mockCampaigns,
      error: null,
    })

    const mockStampsSelect = vi.fn()
    const mockStampsIn = vi.fn()

    mockFrom.mockReturnValueOnce({ select: mockSelect })
    mockFrom.mockReturnValueOnce({ select: mockStampsSelect })
    mockStampsSelect.mockReturnValue({ in: mockStampsIn })
    mockStampsIn.mockResolvedValue({
      count: null,
      error: null,
    })

    const result = await getTotalStampsByBusiness('business-1')

    expect(result).toEqual({ data: 0, error: null })
  })

  it('should handle unexpected exceptions', async () => {
    mockEq.mockRejectedValue(new Error('Unexpected error'))

    const result = await getTotalStampsByBusiness('business-1')

    expect(result.data).toBeNull()
    expect(result.error).toBeInstanceOf(Error)
  })
})
