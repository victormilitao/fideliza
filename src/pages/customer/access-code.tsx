import { Button } from '@/components/button/button'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { useToast } from '@/hooks/useToast'

export const AccessCode = () => {
  const toast = useToast()

  const handleAccess = () => {
    try {
    } catch (error) {
      toast.error('O código informado está incorreto.')
    }
  }

  return (
    <div className='flex flex-col items-center justify-center h-fit'>
      <div className='flex flex-col gap-6'>
        <p className='text-center text-sm'>
          Enviamos um código via SMS para validar o celular (00) 00000 - 0000
        </p>
        <p className='text-center text-sm'>Digite o código recebido</p>
        <div className='flex justify-center'>
          <InputOTP maxLength={4}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button onClick={handleAccess}>Confirmar</Button>
      </div>
    </div>
  )
}
