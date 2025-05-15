import { Campaign } from "./campaign.type"
import { Card } from "./card.type"

export type Business = {
  id?: string
  name?: string
  userId?: string
  createdAt?: string
  address?: string
  cards?: Card[]
  campaigns?: Campaign[]
  campaign?: Campaign
}