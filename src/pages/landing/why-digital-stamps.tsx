import womanOnPhone from '/landing/woman-on-phone.png'
import chat from '/landing/chat.png'
import { Button } from '@/components/button/button'
import { useNavigate } from 'react-router-dom'

export const WhyDigitalStamps = () => {
  const navigate = useNavigate()

  const Part1 = () => {
    return (
      <div className='mt-12 px-8 sm:px-0 sm:max-w-none sm:mx-auto'>
        <h2 className='text-xl font-bold text-primary-600 mb-4'>
          Por que trocar o cartãozinho de papel por selos digitais?
        </h2>
        <p className='text-neutral-700'>
          Programas de fidelidade com cartão de papel até funcionam — mas vamos
          ser sinceros:{' '}
          <strong>
            quantos clientes já esqueceram, perderam ou ficaram frustrados por
            aparecer no estabelecimento sem o cartão em mãos?
          </strong>
        </p>
        <p className='mt-4 text-neutral-700'>
          Com um programa de selos digital, você evita esse desgaste para o
          cliente e ainda simplifica tudo para o seu negócio.
        </p>
      </div>
    )
  }

  const WomanOnPhone = () => {
    return (
      <div className='max-w-4xl lg:max-w-2xl mt-10 -ml-12 lg:mt-0 lg:ml-0'>
        <img src={womanOnPhone} alt='Mulher usando celular' />
      </div>
    )
  }

  const Chat = () => {
    return (
      <div className='mx-auto max-w-lg lg:mt-22'>
        <img src={chat} alt='Chat' className='w-full h-auto rounded-2xl' />
      </div>
    )
  }

  const Footer = () => {
    return (
      <div className='px-8 lg:px-0 mb-10 lg:mb-0'>
        <p className=''>
          O sistema digital traz mais agilidade: você{' '}
          <strong className='font-bold text-primary-600'>
            configura em minutos
          </strong>
          , gerencia com facilidade e ainda oferece uma experiência moderna,
          prática e personalizada para seus clientes.
        </p>
        <p className='mt-3 '>
          Chega de papelzinho perdido na bolsa ou na gaveta. Com selos digitais,
          a fidelização acontece do jeito certo — simples para o cliente,
          eficiente para você.
        </p>
        <Button className='mt-5 w-full' onClick={() => navigate('/login')}>
          Acessar minha conta
        </Button>
      </div>
    )
  }

  const DontWorry = () => {
    return (
      <div className='mt-10 px-8 lg:px-0'>
        <h3 className='text-xl font-bold mb-2'>Nada de se preocupar com:</h3>
        <ul className='text-error-600 font-semibold space-y-1 mb-3 line-through [text-decoration-thickness:1px]'>
          <li>Impressão de cartões</li>
          <li>Estoque de adesivos</li>
          <li>Carimbo que some, quebra ou falha</li>
        </ul>
      </div>
    )
  }

  return (
    <section className='bg-white sm:px-6 lg:py-20'>
      {/* Desktop and larger screens */}
      <div className='hidden lg:grid lg:max-w-6xl mx-auto justify-center items-center lg:grid-cols-[1fr_2fr] lg:gap-10 lg:items-start'>
        <div className=''>
          <Part1 />
          <Chat />
        </div>

        <div className='space-y-10'>
          <WomanOnPhone />

          <div className='max-w-lg'>
            <DontWorry />
            <Footer />
          </div>
        </div>
      </div>

      {/* Mobile and smaller screens */}
      <div className='visible lg:hidden mx-auto flex flex-col'>
        <Part1 />
        <WomanOnPhone />
        <DontWorry />
        <Chat />
        <Footer />
      </div>
    </section>
  )
}
