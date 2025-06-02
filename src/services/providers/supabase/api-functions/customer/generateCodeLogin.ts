import { Response } from '@/services/types/api.type'
import supabase from '../../config'
import { generateCode } from '@/utils/generateCode'
import { PersonCode } from '@/types/personCode.type'

export const generateCodeLogin = async (
  personId: string
): Promise<Response<PersonCode>> => {
  try {
    const { data, error } = await supabase
      .from('person_codes')
      .upsert(
        { person_id: personId, login: generateCode() },
        { onConflict: 'person_id' }
      )
      .select()
      .maybeSingle()

    if (error) throw new Error('Failed to generate login code')

    return { data, error: null }
  } catch (err) {
    console.error('generateCodeLogin - Unexpected error:', err)
    return { data: null, error: err as Error }
  }
}
