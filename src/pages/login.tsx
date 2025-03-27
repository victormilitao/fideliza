import React from 'react'
import { Input } from '../components/input'
import { Button } from '../components/button'

const Login: React.FC = () => {
  return (
    <div className='flex flex-col gap-8 items-center justify-center h-screen'>
      <h2><b>Acesse sua conta</b></h2>
      <Input />
      <Input />
      <Button>Entrar</Button>
    </div>
  )
}

export default Login
