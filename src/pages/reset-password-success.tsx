import React from 'react'
import { Button } from '../components/button/button'
import { useNavigate } from 'react-router-dom'
import Icon from '../components/icon'

export const ResetPasswordSuccess: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div className='flex flex-col items-center justify-center min-h-[100dvh] py-10'>
      <h1 className='text-center text-primary-600 font-bold text-2xl mt-10'>
        Eloop
      </h1>
      <div className='flex flex-col gap-6 w-3xs my-auto items-center'>
        <h2 className='text-center text-primary-600 font-bold text-xl'>
          Acesse sua conta
        </h2>
        <div className='flex items-center justify-center w-20 h-20 rounded-full bg-primary-100'>
          <Icon
            name='CheckCircle'
            size={48}
            color='var(--color-primary-600)'
            fill='var(--color-primary-600)'
          />
        </div>
        <p className='text-center text-sm text-neutral-700'>
          Senha redefinida com sucesso!
        </p>
        <Button className='w-full' onClick={() => navigate('/login')}>
          Ok
        </Button>
      </div>
    </div>
  )
}

