import { Response } from '@/services/types/api.type'
import supabase from '../../config'
import { generateCode } from '@/utils/generateCode'

export const generateCodeLogin = async (
  personId: string
): Promise<Response<boolean>> => {
  try {
    const { error } = await supabase
      .from('person_codes')
      .upsert(
        { person_id: personId, login: generateCode() },
        { onConflict: 'person_id' }
      )

    if (error) throw new Error('Failed to generate login code')

    return { data: true, error: null }
  } catch (err) {
    console.error('generateCodeLogin - Unexpected error:', err)
    return { data: false, error: err as Error }
  }
}
