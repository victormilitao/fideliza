import { Business } from './business.type'
import { Card } from './card.type'

export type Campaign = {
  id?: string
  created_at?: string
  rule?: string
  business_id?: string
  prize?: string
  stamps_required?: number
  business?: Business
  cards?: Card[]
}
