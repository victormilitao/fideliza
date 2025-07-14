import Icon from '@/components/icon'

export const Contact = () => {
  return (
    <section className='bg-neutral-200 py-16 px-6'>
      <div className='max-w-3xl mx-auto text-center'>
        <h2 className='text-3xl font-bold text-primary-600 flex justify-center items-start gap-2 mb-4'>
          <Icon name='MessageCircle' size={32} strokeWidth={2} />
          Fale a com gente
        </h2>
        <p className='text-xl mb-1'>
          Tem dúvidas, precisa de ajuda ou quer saber mais?
        </p>
        <p className='text-xl font-bold mb-6'>
          Converse com a gente direto no WhatsApp
        </p>
        <a
          href='https://wa.me/5585981508552'
          target='_blank'
          rel='noopener noreferrer'
          className='inline-flex items-center gap-2 bg-whatsapp text-white font-semibold px-6 py-3 rounded-lg text-lg transition'
        >
          Conversar no WhatsApp
        </a>
      </div>
    </section>
  )
}
