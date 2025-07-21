import { Response } from '@/services/types/api.type'
import supabase from '../config'
import { Business } from '@/types/business.type'

export const getBusinessCardsByPersonId = async (
  personId: string
): Promise<Response<Business[]>> => {
  try {
    const { data, error } = await supabase.rpc(
      'get_business_structure_by_person',
      { p_person_id: personId }
    )

    if (error) {
      throw new Error(
        `getBusinessCardsByPersonId - Error fetching data: ${error}`
      )
    }

    handleResponse(data as Business[])

    return { data: data || [], error }
  } catch (err) {
    console.error('getBusinessCardsByPersonId - Unexpected error:', err)
    return { data: [], error: err as Error }
  }
}

const handleResponse = (data: Business[]) => {
  if (!data || !data.length) {
    data = []
    return
  }
  data.forEach((business) => {
    if (business.campaigns?.[0]) business.campaign = business.campaigns[0]
  })
}
