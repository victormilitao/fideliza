import { Campaign } from './campaign.type'
import { Stamp } from './stamp.type'

export type Card = {
  id?: string
  personId?: string
  campaignId?: string
  stamps: Stamp[]
  campaign?: Campaign
  completed_at?: string
  prize_code?: string
  prized_at?: string
}
