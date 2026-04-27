import Icon from '@/components/icon'
import Link from 'next/link'

export const AccessAccount = () => {
  return (
    <div className='flex flex-col items-center justify-center min-h-[100dvh] px-6'>
      <h1 className='text-xl font-bold text-primary-600 mb-8'>
        Acessar conta como
      </h1>

      <div className='flex gap-6'>
        <Link
          href='/login'
          className='flex flex-col items-center justify-center gap-3 w-40 h-36 rounded-2xl border border-neutral-400/40 bg-white hover:border-primary-300 hover:shadow-md transition-all cursor-pointer'
        >
          <Icon
            name='Store'
            size={32}
            strokeWidth={1.5}
            className='text-primary-600'
          />
          <span className='text-sm font-semibold text-primary-600'>
            Estabelecimento
          </span>
        </Link>

        <Link
          href='/user/login'
          className='flex flex-col items-center justify-center gap-3 w-40 h-36 rounded-2xl border border-neutral-400/40 bg-white hover:border-primary-300 hover:shadow-md transition-all cursor-pointer'
        >
          <Icon
            name='UserRound'
            size={32}
            strokeWidth={1.5}
            className='text-primary-600'
          />
          <span className='text-sm font-semibold text-primary-600'>
            Consumidor
          </span>
        </Link>
      </div>
    </div>
  )
}
