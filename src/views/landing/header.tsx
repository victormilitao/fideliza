'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BottomSheet } from '@/components/bottom-sheet'
import Icon from '@/components/icon'

export const Header = () => {
  const [openSheet, setOpenSheet] = useState(false)

  return (
    <header className='flex justify-between items-center px-6 py-5 sm:px-10 sm:py-8'>
      <h1 className='text-[2rem] font-bold text-primary-600'>Eloop</h1>
      <button
        onClick={() => setOpenSheet(true)}
        className='text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors cursor-pointer'
      >
        Acessar minha conta
      </button>

      <BottomSheet open={openSheet} onOpenChange={setOpenSheet}>
        <div className='flex flex-col items-center pb-4'>
          <h2 className='text-xl font-bold text-primary-600 mb-8'>
            Acessar conta como
          </h2>

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
      </BottomSheet>
    </header>
  )
}
