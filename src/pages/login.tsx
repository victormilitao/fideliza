import React, { useState } from 'react'
import { Input } from '../components/input'
import { Button } from '../components/button/button'
import { useAuth } from '@/hooks/useAuth'

export const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, loading } = useAuth()

  const handleLogin = () => login({ email, password })

  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='flex flex-col gap-6 w-3xs'>
        <h2 className='text-center'>
          <b>Acesse sua conta</b>
        </h2>
        <Input
          label='Email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label='Senha'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button className='w-full' onClick={handleLogin}>
          Entrar
        </Button>
      </div>
    </div>
  )
}
