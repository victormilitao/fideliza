import { Campaign } from "./campaign.type"
import { Card } from "./card.type"

export type Business = {
  id?: string
  name?: string
  user_id?: string
  userId?: string
  createdAt?: string
  cep?: string
  state?: string
  city?: string
  neighborhood?: string
  street?: string
  streetNumber?: string
  complement?: string
  cards?: Card[]
  campaigns?: Campaign[]
  campaign?: Campaign
}