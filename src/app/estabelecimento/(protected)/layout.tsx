'use client'

import { useAuthStore } from '@/store/useAuthStore'
import { BUSINESS_OWNER } from '@/types/profile'
import { redirect } from 'next/navigation'

export default function BusinessProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isLoggedIn, profile, hasHydrated } = useAuthStore()

  if (!hasHydrated) return null

  if (!isLoggedIn || profile?.role !== BUSINESS_OWNER) {
    redirect('/login')
  }

  return <>{children}</>
}
