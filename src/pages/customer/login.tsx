import { BottomSheet } from '@/components/bottom-sheet'
import { Button } from '@/components/button/button'
import { Input } from '@/components/input'
import { useState } from 'react'
import { AccessCode } from './access-code'

export const LoginCustomer: React.FC = () => {
  const [openSheet, setOpenSheet] = useState(false)

  const handleAccess = () => {
    setOpenSheet(!openSheet)
  }

  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='flex flex-col gap-6 w-3xs'>
        <h2 className='text-center'>
          <b>Use seu número de celular para acessar e acompanhar seus selos.</b>
        </h2>
        <Input
          label='Celular'
          maskType='phone'
          placeholder='(00) 0 0000-0000'
        />

        <Button className='w-full' onClick={handleAccess}>
          Acessar
        </Button>

        <BottomSheet open={openSheet} onOpenChange={setOpenSheet}>
          <AccessCode />
        </BottomSheet>
      </div>
    </div>
  )
}
