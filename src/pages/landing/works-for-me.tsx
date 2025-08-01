import Icon, { LucideIconNames } from '@/components/icon'

type BusinessTypeProps = {
  icon: LucideIconNames
  label: string
}

export const WorksForMe = () => {
  const businessTypes: BusinessTypeProps[] = [
    { icon: 'Coffee', label: 'Cafeteria' },
    { icon: 'PawPrint', label: 'Pet Shop' },
    { icon: 'BookOpen', label: 'Livraria' },
    { icon: 'Pizza', label: 'Pizzaria' },
    { icon: 'Car', label: 'Lava Jato' },
    { icon: 'ShoppingBasket', label: 'Mercado' },
    { icon: 'Utensils', label: 'Restaurante' },
    { icon: 'Scissors', label: 'Barbearia' },
  ]

  const BusinessType = ({ label, icon }: BusinessTypeProps) => (
    <div className='flex flex-col items-center text-center'>
      <div
        className='mb-2 flex items-center justify-center'
        aria-label={label}
        title={label}
      >
        <Icon name={icon} className='text-primary-200' size={56} />
      </div>
      <span className='text-base'>{label}</span>
    </div>
  )

  return (
    <section className='bg-primary-700 text-neutral-100 py-14 lg:py-20 px-8 lg:px-6'>
      <div className='max-w-md sm:max-w-lg lg:max-w-6xl lg:grid lg:grid-cols-[1fr_1.5fr] items-center mx-auto flex flex-col'>
        <div className='lg:max-w-3xl mx-auto mb-12'>
          <p className='sm:text-xl'>Fidelidade com selos</p>
          <h2 className='text-xl sm:text-[2.5rem] font-bold mb-3'>
            É para o meu negócio?
          </h2>
          <p className='sm:text-xl'>
            Um programa de fidelidade com selos pode ser uma forma eficaz de
            engajar seus clientes e fortalecer a relação com a sua marca.
          </p>
        </div>

        <div className='flex flex-col items-center justify-center'>
          <div className='inline-block bg-primary-400/30 backdrop-blur text-base px-14 sm:px-10 py-3 rounded-full font-bold mb-10 shadow-[0px_0px_16px_0px_#FFFFFF26]'>
            Negócios que já descobriram o valor de fidelizar com selos
          </div>

          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-12 sm:gap-4 lg:gap-6 max-w-64 sm:max-w-lg w-full text-sm text-gray-100'>
            {businessTypes.map((businessType) => (
              <BusinessType
                key={businessType.label}
                label={businessType.label}
                icon={businessType.icon}
              />
            ))}
          </div>

          <p className='mt-8 text-xl'>E muitos outros</p>
        </div>
      </div>
    </section>
  )
}
