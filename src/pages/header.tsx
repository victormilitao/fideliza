import { Button } from '@/components/button/button'
import { useLogout } from '@/hooks/useLogout'
import { useAuthStore } from '@/store/useAuthStore'
import { Link } from 'react-router-dom'

export const Header = () => {
  const { session } = useAuthStore()
  const { logout } = useLogout()

  const handleLogout = () => {
    logout()
  }

  return (
    <header className='w-full'>
      <div className='flex justify-between items-center px-6 py-5 lg:px-10 lg:py-8'>
        <h1 className='text-xl sm:text-[2rem] font-bold text-primary-600'>
          Eloop
        </h1>
        {!session && (
          <h1 className='text-base font-bold text-primary-600'>
            <Link to={'/login'}>Acessar minha conta</Link>
          </h1>
        )}
        {session && (
          <Link to={'/estabelecimento/login'}>
            <Button variant='link' onClick={handleLogout}>
              Sair
            </Button>
          </Link>
        )}
      </div>
    </header>
  )
}
