import { Stamp } from "./stamp.type"

export type Card = {
  id?: string
  personId?: string
  campaignId?: string
  stamp: Stamp[]
}