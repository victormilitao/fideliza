import { BottomSheet } from '@/components/bottom-sheet'
import { Button } from '@/components/button/button'
import { Input } from '@/components/input'
import { useState } from 'react'
import { AccessCode } from './access-code'
import z from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/hooks/customer/useAuth'
import { Person } from '@/types/person.type'

const schema = z.object({
  phone: z.string().nonempty('Telefone inválido').nonempty('Campo obrigatório'),
})

type LoginSchema = z.infer<typeof schema>

export const LoginCustomer: React.FC = () => {
  const [openSheet, setOpenSheet] = useState<boolean>(false)
  const [phone, setPhone] = useState<string>('')
  const [person, setPerson] = useState<Person | null>(null)
  const { checkPersonExisting } = useAuth()
  const {
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<LoginSchema>({
    resolver: zodResolver(schema),
  })

  const handleAccess = async (data: LoginSchema) => {
    const sanitizedPhone = data.phone.replace(/\D/g, '')
    const response = await checkPersonExisting(sanitizedPhone)
    if (response.data) {
      setPerson(response.data)
      setPhone(sanitizedPhone)
      setOpenSheet(!openSheet)
    }
  }

  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='flex flex-col gap-6 w-3xs'>
        <h2 className='text-center'>
          <b>Use seu número de celular para acessar e acompanhar seus selos.</b>
        </h2>
        <Controller
          name='phone'
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              label='Celular'
              maskType='phone'
              placeholder='(00) 0 0000-0000'
              error={errors.phone?.message}
            />
          )}
        />

        <Button className='w-full' onClick={handleSubmit(handleAccess)}>
          Acessar
        </Button>

        <BottomSheet open={openSheet} onOpenChange={setOpenSheet}>
          <AccessCode phone={phone} person={person} />
        </BottomSheet>
      </div>
    </div>
  )
}
