import { Button } from '@/components/button/button'
import {
  InputOTP,
  InputOTPGroup, InputOTPSlot
} from '@/components/ui/input-otp'

export const Reward = () => {
  return (
    <div className='flex flex-col items-center justify-center h-fit'>
      <div className='flex flex-col gap-6'>
        <p className='text-center text-sm'>
          Digite abaixo o código recebido pelo cliente
        </p>
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
        <Button>Premiar</Button>
      </div>
    </div>
  )
}
