import supabase from '../config'
import { Stamp } from '@/types/stamp.type'

export const addStamp = async (stamp: Stamp): Promise<void> => {
  try {
    await supabase
      .from('stamp')
      .insert([{ business_id: stamp.businessId, user_id: stamp.userId }])
      .select()
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}
