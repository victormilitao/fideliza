import womanOnPhone from '/landing/woman-on-phone.png'
import chat from '/landing/chat.png'
import { Button } from '@/components/button/button'

export const WhyDigitalStamps = () => {
  return (
    <section className='bg-white py-20 px-6'>
      <div className='max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 items-start'>
        <div className='space-y-10'>
          <div>
            <h2 className='text-xl font-bold text-primary-600 mb-4'>
              Por que trocar o cartãozinho de papel por selos digitais?
            </h2>
            <p className='text-neutral-700'>
              Programas de fidelidade com cartão de papel até funcionam — mas
              vamos ser sinceros:{' '}
              <strong>
                quantos clientes já esqueceram, perderam ou ficaram frustrados
                por aparecer no estabelecimento sem o cartão em mãos?
              </strong>
            </p>
            <p className='mt-4 text-neutral-700'>
              Com um programa de selos digital, você evita esse desgaste para o
              cliente e ainda simplifica tudo para o seu negócio.
            </p>
          </div>

          <div className='mt-40 max-w-sm'>
            <img src={chat} alt='Chat' className='w-full h-auto rounded-2xl' />
          </div>
        </div>

        <div className='space-y-10'>
          <div className='min-w-lg'>
            <img src={womanOnPhone} alt='Mulher usando celular' />
          </div>

          <div className='max-w-lg'>
            <h3 className='text-xl font-bold mb-2'>
              Nada de se preocupar com:
            </h3>
            <ul className='text-error-600 font-semibold space-y-2 mb-4 line-through [text-decoration-thickness:1px]'>
              <li>Impressão de cartões</li>
              <li>Estoque de adesivos</li>
              <li>Carimbo que some, quebra ou falha</li>
            </ul>
            <p className=''>
              O sistema digital traz mais agilidade: você{' '}
              <strong className='font-bold text-primary-600'>
                configura em minutos
              </strong>
              , gerencia com facilidade e ainda oferece uma experiência moderna,
              prática e personalizada para seus clientes.
            </p>
            <p className='mt-4 '>
              Chega de papelzinho perdido na bolsa ou na gaveta. Com selos
              digitais, a fidelização acontece do jeito certo — simples para o
              cliente, eficiente para você.
            </p>
            <Button className='mt-10 w-full'>Acessar minha conta</Button>
          </div>

        </div>
      </div>
    </section>
  )
}
