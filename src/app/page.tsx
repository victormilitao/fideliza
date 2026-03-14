'use client'

import { useAuthStore } from '@/store/useAuthStore'
import { BUSINESS_OWNER, CUSTOMER } from '@/types/profile'
import { redirect } from 'next/navigation'
import { Landing } from '@/views/landing/landing'

export default function RootPage() {
  const { isLoggedIn, profile, hasHydrated } = useAuthStore()

  if (!hasHydrated) return null

  if (!isLoggedIn) return <Landing />
  if (profile?.role === BUSINESS_OWNER) redirect('/estabelecimento')
  if (profile?.role === CUSTOMER) redirect('/usuario')
  redirect('/login')
}
