import { Button } from '@/components/button/button'
import Icon from '@/components/icon'
import { useRouter } from 'next/navigation'

export const Pricing = () => {
  const router = useRouter()

  return (
    <section
      className='pt-4 pb-16 lg:pt-6 lg:pb-20 px-6'
      style={{
        background:
          'linear-gradient(180deg, #FFFFFF 0%, #F3F9FF 20%, #EBF5FF 40%, #F3F9FF 70%, #FFFFFF 100%)',
      }}
    >
      <div className='max-w-4xl mx-auto text-center'>
        <h2 className='text-2xl sm:text-3xl font-bold text-primary-600 mb-3'>
          Experimente sem compromisso
        </h2>
        <p className='text-neutral-700 mb-10 max-w-xl mx-auto'>
          Comece com 50 selos grátis para testar e veja como o seu negócio pode crescer
        </p>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto'>
          {/* Free Plan */}
          <div className='bg-white rounded-2xl py-16 px-8 flex flex-col items-center shadow-sm border border-primary-300 min-h-[488px]'>
            <div className='flex flex-col items-center h-[100px]'>
              <p className='text-2xl font-bold text-primary-600 mb-3'>
                Teste grátis
              </p>
              <div className='flex items-baseline gap-1'>
                <span className='text-4xl font-bold text-primary-600'>R$ 0</span>
              </div>
            </div>

            <div className='mb-10' />

            <ul className='space-y-3 text-left w-full max-w-[283px]'>
              <li className='flex items-center gap-3 text-sm text-neutral-700'>
                <span className='bg-primary-100 rounded-full p-1 shrink-0'>
                  <Icon
                    name='Check'
                    size={14}
                    strokeWidth={3}
                    className='text-primary-600'
                  />
                </span>
                <span>
                  <strong>50 selos para enviar</strong>
                </span>
              </li>
              <li className='flex items-center gap-3 text-sm text-neutral-700'>
                <span className='bg-primary-100 rounded-full p-1 shrink-0'>
                  <Icon
                    name='Check'
                    size={14}
                    strokeWidth={3}
                    className='text-primary-600'
                  />
                </span>
                <span>Acesso completo a todos os recursos</span>
              </li>
              <li className='flex items-center gap-3 text-sm text-neutral-700'>
                <span className='bg-primary-100 rounded-full p-1 shrink-0'>
                  <Icon
                    name='Check'
                    size={14}
                    strokeWidth={3}
                    className='text-primary-600'
                  />
                </span>
                <span>Sem cartão de crédito</span>
              </li>
              <li className='flex items-center gap-3 text-sm text-neutral-700'>
                <span className='bg-primary-100 rounded-full p-1 shrink-0'>
                  <Icon
                    name='Check'
                    size={14}
                    strokeWidth={3}
                    className='text-primary-600'
                  />
                </span>
                <span>Cancele quando quiser</span>
              </li>
            </ul>

            <Button
              className='w-full max-w-[283px] h-[50px] text-base font-bold mt-10'
              onClick={() => router.push('/store/create')}
            >
              Começar teste grátis
            </Button>
          </div>

          {/* Unlimited Plan */}
          <div className='bg-primary-600 rounded-2xl py-16 px-8 flex flex-col items-center shadow-sm border border-primary-600 min-h-[488px]'>
            <div className='flex flex-col items-center h-[100px]'>
              <p className='text-2xl font-bold text-white mb-3'>
                Plano ilimitado
              </p>
              <div className='flex items-baseline gap-1'>
                <span className='text-sm text-white'>R$</span>
                <span className='text-4xl font-bold text-white'>27,90</span>
                <span className='text-sm text-white'>/mês</span>
              </div>
            </div>

            <div className='mb-10' />

            <ul className='space-y-3 text-left w-full max-w-[283px]'>
              <li className='flex items-center gap-3 text-sm text-white'>
                <span className='bg-white/20 rounded-full p-1 shrink-0'>
                  <Icon
                    name='Check'
                    size={14}
                    strokeWidth={3}
                    className='text-white'
                  />
                </span>
                <span>
                  <strong>Selos ilimitados</strong>
                </span>
              </li>
              <li className='flex items-center gap-3 text-sm text-white'>
                <span className='bg-white/20 rounded-full p-1 shrink-0'>
                  <Icon
                    name='Check'
                    size={14}
                    strokeWidth={3}
                    className='text-white'
                  />
                </span>
                <span>Sem taxas por envio</span>
              </li>
              <li className='flex items-center gap-3 text-sm text-white'>
                <span className='bg-white/20 rounded-full p-1 shrink-0'>
                  <Icon
                    name='Check'
                    size={14}
                    strokeWidth={3}
                    className='text-white'
                  />
                </span>
                <span>Cancelamento a qualquer momento</span>
              </li>
              <li className='flex items-center gap-3 text-sm text-white'>
                <span className='bg-white/20 rounded-full p-1 shrink-0'>
                  <Icon
                    name='Check'
                    size={14}
                    strokeWidth={3}
                    className='text-white'
                  />
                </span>
                <span>Pagamento mensal no cartão</span>
              </li>
            </ul>

            <button
              className='w-full max-w-[283px] h-[50px] rounded-sm bg-white text-primary-600 text-sm font-bold hover:bg-white/90 transition-colors cursor-pointer mt-10'
              onClick={() => router.push('/store/create')}
            >
              Assinar
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}
