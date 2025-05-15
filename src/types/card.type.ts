import { Campaign } from './campaign.type'
import { Stamp } from './stamp.type'

export type Card = {
  id?: string
  personId?: string
  campaignId?: string
  stamp: Stamp[]
  campaign?: Campaign
}
