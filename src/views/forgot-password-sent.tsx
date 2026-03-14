import React from 'react'
import { Button } from '@/components/button/button'
import Link from 'next/link'
import Icon from '@/components/icon'

export const ForgotPasswordSent: React.FC = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-[100dvh] py-10'>
      <h1 className='text-center text-primary-600 font-bold text-2xl md:text-3xl mt-10'>
        Eloop
      </h1>
      <div className='flex flex-col gap-6 w-[90%] max-w-xs my-auto items-center'>
        <div className='flex flex-col gap-4 items-center'>
          <Icon
            name='CheckCircle'
            size={48}
            color='var(--color-primary-600)'
          />
          <p className='text-neutral-700 text-base text-center'>
            As instruções para redefinir sua senha foram enviadas para o seu
            e-mail.
          </p>
        </div>
        <Link href='/login' className='w-full'>
          <Button className='w-full' type='button'>
            Login
          </Button>
        </Link>
      </div>
    </div>
  )
}
