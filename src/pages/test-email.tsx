import { useState } from 'react'
import { Button } from '@/components/button/button'
import { Input } from '@/components/input'
import { useEmail } from '@/hooks/useEmail'

export const TestEmail = () => {
  const [email, setEmail] = useState('')
  const { sendTestEmail, sendEmailConfirmation, isSendingTest, isSendingConfirmation } = useEmail()

  const handleTestEmail = () => {
    if (!email) return
    sendTestEmail({ email })
  }

  const handleTestConfirmation = () => {
    if (!email) return
    const testLink = 'https://exemplo.com/confirmar-email'
    sendEmailConfirmation({ email, link: testLink })
  }

  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50'>
      <div className='w-full max-w-md bg-white rounded-lg shadow-md p-6'>
        <h1 className='text-2xl font-bold text-primary-600 mb-6 text-center'>
          Teste de Email
        </h1>
        
        <div className='space-y-4'>
          <Input
            label='Email para teste'
            type='email'
            placeholder='seu-email@gmail.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <div className='space-y-3'>
            <Button
              onClick={handleTestEmail}
              loading={isSendingTest}
              className='w-full'
            >
              Enviar Email de Teste
            </Button>
            
            <Button
              onClick={handleTestConfirmation}
              loading={isSendingConfirmation}
              variant='secondary'
              className='w-full'
            >
              Enviar Confirmação de Email
            </Button>
          </div>
          
          <div className='mt-6 p-4 bg-blue-50 rounded-lg'>
            <h3 className='font-semibold text-blue-800 mb-2'>Instruções:</h3>
            <ul className='text-sm text-blue-700 space-y-1'>
              <li>• Digite seu email no campo acima</li>
              <li>• Clique em "Enviar Email de Teste" para um email simples</li>
              <li>• Clique em "Enviar Confirmação" para testar com link</li>
              <li>• Verifique sua caixa de entrada</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
