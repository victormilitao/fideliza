import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface TabNavigationProps {
  tabs: {
    label: string
    href: string
  }[]
}

export const TabNavigation = ({ tabs }: TabNavigationProps) => {
  const pathname = usePathname()

  return (
    <div className='border-b border-gray-200 bg-white'>
      <div className='px-6 sm:px-10'>
        <nav className='flex gap-8'>
          {tabs.map((tab) => {
            const isActive = pathname === tab.href
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  'pb-1 border-b-2 font-medium text-sm transition-colors',
                  isActive
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-neutral-700'
                )}
              >
                {tab.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

