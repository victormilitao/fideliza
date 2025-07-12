import twoPhones from '/landing/two-phones.png'

export default function Intro() {
  return (
    <section className='px-6 pt-10 pb-16 flex flex-col lg:flex-row items-center justify-between gap-10 max-w-7xl mx-auto'>
      <div className='max-w-xl'>
        <h2 className='text-3xl sm:text-4xl font-bold text-[#002060] mb-4'>
          Seu cliente coleciona <span className='text-[#005EBC]'>selos</span>.
          <br />
          Você coleciona fidelidade.
        </h2>
        <p className='bg-[#E3F1FC] text-[#005EBC] text-sm font-medium inline-block px-4 py-1 rounded-full mb-4'>
          Programa de fidelidade 100% digital
        </p>
        <p className='text-lg text-[#333] mb-6'>
          O seu cliente junta <strong>selos</strong> e acompanha tudo{' '}
          <strong>online</strong>, sem cadastro e sem baixar aplicativo.
        </p>
        <a
          href='#comecar'
          className='inline-block bg-[#002060] text-white text-sm font-medium px-6 py-3 rounded-md hover:bg-[#003399] transition'
        >
          Criar programa de fidelidade grátis
        </a>
      </div>

      <img
        src={twoPhones}
        alt='Exemplo da interface'
        className='w-full max-w-md mx-auto'
      />
    </section>
  )
}
