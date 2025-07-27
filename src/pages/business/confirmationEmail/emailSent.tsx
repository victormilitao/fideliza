import { Button } from '@/components/button/button'
import Icon from '@/components/icon'
import { useUserAttributes } from '@/hooks/user/useUserAttributes'
import { Header } from '@/pages/header'
import { Link, useParams } from 'react-router-dom'

export const EmailSent = () => {
  const { userId } = useParams<{ userId: string }>()
  // const { user } = useUserAttributes(userId || '')
  return (
    <>
      <Header />
      <div className='flex flex-col sm:items-center justify-center min-h-full py-8 px-6 min-w-64 sm:max-w-96 mx-auto'>
        <div>
          <Icon
            name='Mail'
            size={32}
            color='var(--color-primary-600)'
            strokeWidth={1.7}
          />
          <h2 className='mt-3 text-primary-600 font-bold text-xl'>
            Confirme seu e-mail
          </h2>
          <p className='font-semibold text-sm mt-2'>
            Para continuar com a criação do seu programa de fidelidade,
            precisamos confirmar seu e-mail.
          </p>
          <p className='text-sm mt-10'>
            Foi enviado um e-mail com um link de verificação para {''}
            <span className='text-primary-600 font-bold'>{userId}</span>.
          </p>
          <p className='text-sm mt-5'>Clique no link para confirmar.</p>
          <p className='text-xs mt-5'>
            Se não encontrar o e-mail na sua caixa de entrada, verifique a pasta
            de spam ou procure pelo remetente: nao-responda@fideliza.com.br.
          </p>
          <Link to={'/estabelecimento/criar'}>
            <Button variant='secondary' className='mt-10 min-w-64 w-full'>
              Voltar
            </Button>
          </Link>
        </div>
      </div>
    </>
  )
}
