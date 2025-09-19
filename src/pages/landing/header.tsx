import { LogoutButton } from '@/components/business/logout-button'

export const Header = () => {
  return (
    <header className='flex justify-between items-center px-6 py-5 sm:px-10 sm:py-8'>
      <h1 className='text-[2rem] font-bold text-primary-600'>Eloop</h1>
      <LogoutButton />
    </header>
  )
}
