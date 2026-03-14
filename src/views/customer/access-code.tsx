import { Button } from '@/components/button/button'
import { Error } from '@/components/error'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { useAuth } from '@/hooks/customer/useAuth'
import { useToast } from '@/hooks/useToast'
import { Person } from '@/types/person.type'
import { applyMask } from '@/utils/mask-utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
import z from 'zod'

const schema = z.object({
  code: z.string().nonempty('Campo obrigatório'),
})
type FormSchema = z.infer<typeof schema>

export const AccessCode = ({ phone, person }: { phone: string, person: Person | null }) => {
  const toast = useToast()
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: { code: '' },
  })
  const { login } = useAuth()
  const maskedPhone = applyMask(phone, 'phone')

  const handleAccess = (data: FormSchema) => {
    try {
      const email = phone + '@fideliza.com'
      const password = 'password'
      login({ credentials: {email, password, code: data.code}, person })
    } catch (error) {
      toast.error('O código informado está incorreto.')
    }
  }

  return (
    <div className='flex flex-col items-center justify-center h-fit'>
      <form onSubmit={handleSubmit(handleAccess)}>
        <div className='flex flex-col gap-6'>
          <p className='text-center text-sm'>
            Enviamos um código via SMS para validar o celular {maskedPhone}
          </p>
          <p className='text-center text-sm'>Digite o código recebido</p>
          <div className='flex justify-center'>
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
          <Button type='submit'>Confirmar</Button>
        </div>
      </form>
    </div>
  )
}
