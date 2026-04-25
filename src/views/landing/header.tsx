import Link from 'next/link'

export const Header = () => {
  return (
    <header className='flex justify-between items-center px-6 py-5 sm:px-10 sm:py-8'>
      <h1 className='text-[2rem] font-bold text-primary-600'>Eloop</h1>
      <Link
        href='/access'
        className='text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors'
      >
        Acessar minha conta
      </Link>
    </header>
  )
}
