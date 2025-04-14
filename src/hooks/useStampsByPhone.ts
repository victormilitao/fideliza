import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStampsByUserId } from './useStampsByUserId';
import { useUserByPhone } from './useUserByPhone';
import { Stamp } from '@/types/stamp.type';

export const useStampsByPhone = () => {
  const { getUserByPhone } = useUserByPhone()
  const navigate = useNavigate()
  const [stamps, setStamps] = useState<Stamp[] | null>(null)
  const [userId, setUserId] = useState<string | undefined>()
  const { data } = useStampsByUserId(userId)

  const getStampsByPhone = useCallback(async (phone: string): Promise<void> => {
    const sanitizedPhone = phone.replace(/\D/g, '')
    const response = await getUserByPhone(sanitizedPhone)

    if (!response?.data?.user_id) return
    setUserId(response.data.user_id)
  }, [getUserByPhone, data])

  useEffect(() => {
    if (data) {
      setStamps(data)
      navigate('/estabelecimento/tickets', { state: { params: data } })
    }
  }, [data])

  return { getStampsByPhone, stamps }
}
