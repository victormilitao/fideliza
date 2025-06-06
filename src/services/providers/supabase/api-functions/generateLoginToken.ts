import { Response } from '@/services/types/api.type'
import supabase from '../config'

export const generateLoginToken = async (
  personId: string
): Promise<Response<string>> => {
  try {
    if (!personId) throw new Error('Person ID is required')

    const { data, error } = await supabase
      .from('login_tokens')
      .upsert(
        {
          person_id: personId,
          expires_at: new Date(Date.now() + 60 * 60 * 1000),
        },
        { onConflict: 'person_id' }
      )
      .select()
      .maybeSingle()

    if (error || !data) throw new Error('Failed to generate login token')

    return { data: data.token, error: null }
  } catch (err) {
    console.error('generateLoginToken - Unexpected error:', err)
    return { data: null, error: err as Error }
  }
}
