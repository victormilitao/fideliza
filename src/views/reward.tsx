import { Button } from '@/components/button/button'
import { Error } from '@/components/error'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { useReward } from '@/hooks/useReward'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'

const schema = z.object({
  code: z.string().nonempty('Campo obrigatório'),
})
type FormSchema = z.infer<typeof schema>

export const Reward = ({
  cardId,
  closeSheet,
}: {
  cardId: string | undefined
  closeSheet: () => void
}) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: { code: '' },
  })
  const { reward } = useReward()

  const handleBonus = async (data: FormSchema) => {
    if (cardId && data.code) {
      const response = await reward(cardId, data.code)
      response && closeSheet()
    }
  }

  return (
    <div className='flex flex-col items-center justify-center h-fit'>
      <form onSubmit={handleSubmit(handleBonus)}>
        <div className='flex flex-col gap-6'>
          <p className='text-center text-sm'>
            Digite abaixo o código recebido pelo cliente
          </p>
          <div className='flex flex-col items-center justify-center'>
            <Controller
              name='code'
              control={control}
              render={({ field }) => (
                <InputOTP
                  maxLength={4}
                  value={field.value}
                  onChange={field.onChange}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
              )}
            />
            <div>
              {errors?.code?.message && <Error msg={errors?.code?.message} />}
            </div>
          </div>
          <Button type='submit'>Premiar</Button>
        </div>
      </form>
    </div>
  )
}
