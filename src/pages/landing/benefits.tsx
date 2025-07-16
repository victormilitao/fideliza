import Icon, { LucideIconNames } from '@/components/icon'
import benefitsImg from '/landing/benefits.png'

type Benefit = {
  icon: LucideIconNames
  title: string
  text: string
}

export default function Benefits() {
  const benefits: Benefit[] = [
    {
      icon: 'BarChart',
      title: 'Aumentar a frequência de visitas dos seus clientes',
      text: 'Transforme visitas esporádicas em hábito. Seu cliente volta porque sabe que está cada vez mais perto do prêmio.',
    },
    {
      icon: 'CircleDollarSign',
      title: 'Elevar o seu ticket médio',
      text: 'Você pode definir regras que incentivem um consumo maior por visita — como premiar compras acima de certo valor ou a combinação de produtos.',
    },
    {
      icon: 'Handshake',
      title: 'Fortalecer a relação com seus clientes',
      text: 'Recompensar quem escolhe seu negócio é uma forma poderosa de criar conexão e fidelidade de verdade.',
    },
    {
      icon: 'Gamepad2',
      title:
        'Transformar a interação com sua marca em uma experiência viciante',
      text: 'Acumular selos se torna uma experiência divertida e envolvente, incentivando o cliente a continuar interagindo com sua marca.',
    },
  ]

  const Benefit = ({ icon, text, title }: Benefit) => {
    return (
      <div
        key={title}
        className='flex flex-col items-center gap-3 max-w-3xs text-center'
      >
        <div className='bg-primary-600 p-4 rounded-full'>
          <Icon
            name={icon}
            className='text-neutral-100'
            size={32}
            strokeWidth={2}
          />
        </div>
        <div>
          <p className='text-base font-bold text-neutral-700 mb-2 mx-auto max-w-[200px]'>{title}</p>
          <p className='text-base text-neutral-700'>{text}</p>
        </div>
      </div>
    )
  }

  return (
    <section className='bg-white px-6 mt-12 lg:mt-20 pb-32 max-w-6xl mx-auto text-center'>
      <h2 className='text-2xl font-bold text-primary-600 mb-12'>
        É hora de criar um programa de fidelidade se você quer:
      </h2>

      <div className='flex flex-col lg:grid lg:grid-cols-3 lg:items-start gap-10 items-center'>
        <div className='space-y-8 mx-auto'>
          {benefits.slice(0, 2).map((benefit) => (
            <Benefit {...benefit} />
          ))}
        </div>

        <div className='flex justify-center'>
          <img
            src={benefitsImg}
            alt='Interface de premiação'
            className='max-w-[470px] h-auto'
          />
        </div>

        <div className='space-y-8 mx-auto'>
          {benefits.slice(2).map((benefit) => (
            <Benefit {...benefit} />
          ))}
        </div>
      </div>
    </section>
  )
}
