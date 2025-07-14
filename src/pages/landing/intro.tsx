import { Button } from '@/components/button/button'
import twoPhones from '/landing/two-phones.png'
import { useNavigate } from 'react-router-dom'

export default function Intro() {
  const navigate = useNavigate()

  return (
    <section className='px-6 pt-10 pb-16 flex flex-col lg:flex-row items-center justify-between gap-10 max-w-5xl mx-auto'>
      <div className='w-full'>
        <div className='max-w-[425px]'>
          <h2 className='text-[2rem] text-primary-600 font-bold'>
            Seu cliente coleciona selos.
          </h2>
          <h2 className='text-2xl text-primary-400'>
            Você coleciona fidelidade.
          </h2>

          <p className='bg-primary-200 text-neutral-700 text-sm font-semibold inline-block px-4 py-2 rounded-full my-4'>
            Programa de fidelidade 100% digital
          </p>
          <p className='text-2xl text-neutral-700 mb-6'>
            O seu cliente junta{' '}
            <strong className='text-primary-600'>selos</strong> e acompanha tudo{' '}
            <strong className='text-primary-600'>online</strong>, sem cadastro e
            sem baixar aplicativo.
          </p>
          <Button className='w-full' onClick={() => navigate('/login')}>
            Acessar minha conta
          </Button>
        </div>
      </div>

      <img
        src={twoPhones}
        alt='Exemplo da interface'
        className='w-full max-w-md mx-auto'
      />
    </section>
  )
}
