import { Link } from 'react-router-dom'

export const Header = () => {
  return (
    <header className='flex justify-between items-center px-6 py-5 lg:px-10 lg:py-8'>
      <h1 className='text-xl sm:text-[2rem] font-bold text-primary-600'>
        Eloop
      </h1>
      <h1 className='text-base font-bold text-primary-600'>
        <Link to={'/login'}>Acessar minha conta</Link>
      </h1>
    </header>
  )
}
