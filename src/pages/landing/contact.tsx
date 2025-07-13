import Icon from '@/components/icon'

export const Contact = () => {
  return (
    <section className='bg-gray-50 py-16 px-6'>
      <div className='max-w-3xl mx-auto text-center'>
        <h2 className='text-xl md:text-2xl font-bold text-[#001f5b] flex justify-center items-center gap-2 mb-4'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={2}
            stroke='currentColor'
            className='w-6 h-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M7 8h10M7 12h4m1 8a9 9 0 100-18 9 9 0 000 18z'
            />
          </svg>
          Fale a com gente
        </h2>
        <p className='text-gray-700 text-lg mb-1'>
          Tem dúvidas, precisa de ajuda ou quer saber mais?
        </p>
        <p className='text-lg font-semibold text-gray-900 mb-6'>
          Converse com a gente direto no WhatsApp
        </p>
        <a
          href='https://wa.me/5585981508552'
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg text-lg transition'
        >
          <Icon name='Phone' className='w-5 h-5' />
          Conversar no WhatsApp
        </a>
      </div>
    </section>
  )
}
