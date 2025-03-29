import React from 'react'
import { Input } from '../components/input'
import { Button } from '../components/button/button'
import { Link } from 'react-router-dom'

const Login: React.FC = () => {
  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='flex flex-col gap-6 w-3xs'>
        <h2 className='text-center'>
          <b>Acesse sua conta</b>
        </h2>
        <Input label='Email' type='email' />
        <Input label='Senha' type='password' />
        <Link to={'/'}>
          <Button className='w-full'>Entrar</Button>
        </Link>
      </div>
    </div>
  )
}

export default Login
