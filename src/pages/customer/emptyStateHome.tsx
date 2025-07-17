import Icon from '@/components/icon'

export const EmptyStateHome = () => {
  return (
    <div className='h-full sm:h-fit flex flex-col gap-3 items-center justify-center'>
      <div className='h-fit sm:h-50 w-50 relative'>
        <Icon
          name='Ticket'
          size={160}
          color='var(--color-neutral-400)'
          fill='var(--color-neutral-100)'
          className='absolute z-20 left-6 bottom-4'
        />
        <Icon
          name='Ticket'
          size={160}
          color='var(--color-primary-700-25)'
          fill='var(--color-neutral-700-25)' 
          className='absolute z-10 bottom-0 opacity-'
        />
      </div>
      <div>
        <p className='max-w-64 sm:max-w-full text-center text-sm sm:text-base text-neutral-600'>
          No momento, você não tem nenhum selo, mas assim que ganhar, ele vai
          aparecer aqui.
        </p>
      </div>
    </div>
  )
}
