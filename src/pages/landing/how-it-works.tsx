import howItWorks from '/landing/how-it-works.gif'
import { Button } from '@/components/button/button'
import Icon from '@/components/icon'
import { useNavigate } from 'react-router-dom'

const steps = [
  {
    icon: <Icon name='Pencil' strokeWidth={2} />,
    title: 'Crie seu programa',
    description:
      'Defina as regras: como o cliente ganha o selo, qual será o prêmio e quantos selos são necessários para conquistar a recompensa.',
  },
  {
    icon: <Icon name='Ticket' strokeWidth={2} />,
    title: 'Envie os selos',
    description:
      'Você ativa um selo usando apenas o número de telefone do cliente. Ele recebe um SMS com o selo e um link para acompanhar o progresso.',
  },
  {
    icon: <Icon name='Trophy' strokeWidth={2} />,
    title: 'Premiação',
    description:
      'Quando o cliente completa a cartela, ele recebe um SMS com um código para resgatar o prêmio. Depois disso, um novo ciclo começa.',
  },
  {
    icon: <Icon name='Users' strokeWidth={2} />,
    title: 'Fidelize de verdade',
    description:
      'Com recompensas atrativas e um sistema fácil de usar, seus clientes voltam mais vezes — e seu negócio cresce.',
  },
]

export default function HowItWorks() {
  const navigate = useNavigate()

  return (
    <section
      className='max-w-5xl mx-auto px-6 py-8 lg:py-16 grid lg:grid-cols-2 items-center'
      id='comecar'
    >
      <div className='flex justify-center order-2 mt-10 lg:mt-0 lg:order-none'>
        <img
          src={howItWorks}
          alt='Demonstração do app'
          className='rounded-md w-xs h-auto shadow-xl'
        />
      </div>

      <div className='max-w-[378px] mx-auto order-1 lg:order-none'>
        <h2 className='text-xl font-bold text-primary-600 mb-6'>
          Como funciona?
        </h2>
        <ul className='space-y-8'>
          {steps.map(({ icon, title, description }) => (
            <li key={title} className='flex items-start gap-4'>
              <div className='bg-primary-100 text-primary-600 rounded-full p-4'>
                {icon}
              </div>
              <div>
                <p className='text-base font-bold text-neutral-700'>{title}</p>
                <p className='text-base text-neutral-700'>{description}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className='mt-10'>
          <Button className='w-full' onClick={() => navigate('/login')}>
            Acessar minha conta
          </Button>
        </div>
      </div>
    </section>
  )
}
