import { BottomSheet } from '@/components/bottom-sheet'
import { Button } from '@/components/button/button'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import z from 'zod'

const schema = z.object({
  code: z.string(),
})
type FormSchema = z.infer<typeof schema>

export const PrizeCode = ({ prizeCode }: { prizeCode: string }) => {
  const [openSheet, setOpenSheet] = useState<boolean>(false)
  const { control } = useForm<FormSchema>({
    defaultValues: { code: '' },
  })

  const handleShowCode = () => {
    setOpenSheet(true)
  }

  const handleClose = () => {
    setOpenSheet(false)
  }

  return (
    <>
      <span
        className='cursor-pointer font-bold text-sm text-primary-600'
        onClick={handleShowCode}
      >
        Mostrar o código de premiação
      </span>
      <BottomSheet open={openSheet} onOpenChange={setOpenSheet}>
        <div className='flex flex-col items-center justify-center h-fit'>
          <div className='flex flex-col gap-6'>
            <p className='text-center text-sm'>
              Informe o código abaixo no estabelecimento para resgatar o prêmio.
            </p>
            <div className='flex justify-center'>
              <Controller
                name='code'
                control={control}
                render={() => (
                  <InputOTP
                    maxLength={4}
                    value={prizeCode}
                    containerClassName='text-primary-700 font-bold'
                    disabled={true}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot
                        index={0}
                        className='text-3xl bg-primary-100'
                      />
                      <InputOTPSlot
                        index={1}
                        className='text-3xl bg-primary-100'
                      />
                      <InputOTPSlot
                        index={2}
                        className='text-3xl bg-primary-100'
                      />
                      <InputOTPSlot
                        index={3}
                        className='text-3xl bg-primary-100'
                      />
                    </InputOTPGroup>
                  </InputOTP>
                )}
              />
            </div>
            <Button onClick={handleClose}>Fechar</Button>
          </div>
        </div>
      </BottomSheet>
    </>
  )
}
