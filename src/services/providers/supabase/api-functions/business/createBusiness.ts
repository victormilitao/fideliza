import { Business } from '@/types/business.type'
import supabase from '../../config'
import { ApiFunctions } from '@/services/types/api-functions.type'
import errorCode from '@/services/errorCode'

export const createBusiness: ApiFunctions['createBusiness'] = async (
  business: Business
) => {
  try {
    const { data, error } = await supabase
      .from('business')
      .insert([business])
      .select('*')
      .maybeSingle()

    if (error || !data) {
      const businessExistsAlready = isBusinessExists(error?.code)
      console.error('Error creating business:', error)
      return {
        data: null,
        error: businessExistsAlready
          ? new Error('Estabelecimento já criado.')
          : new Error('Error na operação.'),
      }
    }

    return { data, error: null }
  } catch (err) {
    console.error('Unexpected error:', err)
    return { data: null, error: new Error('Unexpected error occurred') }
  }
}

const isBusinessExists = (code: string | undefined): boolean => {
  return code === errorCode.UNIQUE
}
