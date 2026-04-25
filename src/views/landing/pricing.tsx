import { Button } from '@/components/button/button'
import Icon from '@/components/icon'
import { useRouter } from 'next/navigation'

export const Pricing = () => {
  const router = useRouter()

  return (
    <section
      className='py-16 lg:py-20 px-6'
      style={{
        background:
          'linear-gradient(180deg, #FFFFFF 0%, #EEF8FF 33%, #F7FBFF 66%, #FFFFFF 100%)',
      }}
    >
      <div className='max-w-4xl mx-auto text-center'>
        <h2 className='text-2xl sm:text-3xl font-bold text-primary-600 mb-3'>
          Experimente sem compromisso
        </h2>
        <p className='text-neutral-700 mb-10 max-w-xl mx-auto'>
          Comece gratuitamente e descubra como um programa de fidelidade pode
          transformar o seu negócio. Quando estiver pronto, faça o upgrade.
        </p>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto'>
          {/* Free Plan */}
          <div className='bg-white rounded-2xl p-8 flex flex-col items-center shadow-sm border border-neutral-400/30'>
            <p className='text-sm font-semibold text-neutral-700 mb-1'>
              Teste grátis
            </p>
            <div className='flex items-baseline gap-1 mb-6'>
              <span className='text-4xl font-bold text-primary-600'>R$ 0</span>
            </div>

            <ul className='space-y-3 text-left w-full mb-8 flex-1'>
              <li className='flex items-start gap-3 text-sm text-neutral-700'>
                <span className='bg-primary-100 rounded-full p-1 shrink-0 mt-0.5'>
                  <Icon
                    name='Check'
                    size={14}
                    strokeWidth={3}
                    className='text-primary-600'
                  />
                </span>
                <span>
                  Até <strong>30 selos</strong> gratuitos
                </span>
              </li>
              <li className='flex items-start gap-3 text-sm text-neutral-700'>
                <span className='bg-primary-100 rounded-full p-1 shrink-0 mt-0.5'>
                  <Icon
                    name='Check'
                    size={14}
                    strokeWidth={3}
                    className='text-primary-600'
                  />
                </span>
                <span>1 campanha ativa</span>
              </li>
              <li className='flex items-start gap-3 text-sm text-neutral-700'>
                <span className='bg-primary-100 rounded-full p-1 shrink-0 mt-0.5'>
                  <Icon
                    name='Check'
                    size={14}
                    strokeWidth={3}
                    className='text-primary-600'
                  />
                </span>
                <span>Suporte por WhatsApp</span>
              </li>
            </ul>

            <Button
              className='w-full text-base font-bold mt-auto'
              onClick={() => router.push('/store/create')}
            >
              Começar agora
            </Button>
          </div>

          {/* Unlimited Plan */}
          <div className='bg-primary-600 rounded-2xl p-8 flex flex-col items-center shadow-sm border border-primary-600'>
            <p className='text-sm font-semibold text-white mb-1'>
              Plano ilimitado
            </p>
            <div className='flex items-baseline gap-1 mb-6'>
              <span className='text-sm text-white/80'>R$</span>
              <span className='text-4xl font-bold text-white'>27,90</span>
              <span className='text-sm text-white/80'>/mês</span>
            </div>

            <ul className='space-y-3 text-left w-full mb-8 flex-1'>
              <li className='flex items-start gap-3 text-sm text-white'>
                <span className='bg-white/20 rounded-full p-1 shrink-0 mt-0.5'>
                  <Icon
                    name='Check'
                    size={14}
                    strokeWidth={3}
                    className='text-white'
                  />
                </span>
                <span>
                  Selos <strong>ilimitados</strong>
                </span>
              </li>
              <li className='flex items-start gap-3 text-sm text-white'>
                <span className='bg-white/20 rounded-full p-1 shrink-0 mt-0.5'>
                  <Icon
                    name='Check'
                    size={14}
                    strokeWidth={3}
                    className='text-white'
                  />
                </span>
                <span>
                  Campanhas <strong>ilimitadas</strong>
                </span>
              </li>
              <li className='flex items-start gap-3 text-sm text-white'>
                <span className='bg-white/20 rounded-full p-1 shrink-0 mt-0.5'>
                  <Icon
                    name='Check'
                    size={14}
                    strokeWidth={3}
                    className='text-white'
                  />
                </span>
                <span>Suporte prioritário</span>
              </li>
            </ul>

            <button
              className='w-full h-10 rounded-sm bg-white text-primary-600 text-sm font-bold hover:bg-white/90 transition-colors cursor-pointer mt-auto'
              onClick={() => router.push('/store/create')}
            >
              Assinar agora
            </button>
          </div>
        </div>

      </div>
    </section>
  )
}
