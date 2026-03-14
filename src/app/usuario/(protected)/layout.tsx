'use client'

import { useAuthStore } from '@/store/useAuthStore'
import { CUSTOMER } from '@/types/profile'
import { redirect } from 'next/navigation'

export default function CustomerProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoggedIn, profile } = useAuthStore()

  if (!isLoggedIn || profile?.role !== CUSTOMER) {
    redirect('/usuario/login')
  }

  return <>{children}</>
}
