import React, { useState } from 'react'
import { Input } from '../components/input'
import { Button } from '../components/button/button'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/useToast'
import api from '@/services/api'

export const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const toast = useToast()
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      const { data, error } = await api.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error('E-mail ou senha incorretos.')
        console.error('Error signing in:', error)
      } else {
        console.log('User signed in:', data)
        navigate('/')
      }
    } catch (err) {
      console.error('Unexpected error:', err)
      toast.error('Ocorreu um erro inesperado. Tente novamente.')
    }
  }

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