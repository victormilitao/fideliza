'use client'

import { useAuthStore } from '@/store/useAuthStore'
import { BUSINESS_OWNER, CUSTOMER } from '@/types/profile'
import { redirect } from 'next/navigation'
import { Landing } from '@/views/landing/landing'
import { Home } from '@/views/home'
import { useEffect, useState } from 'react'

export default function RootPage() {
  const { isLoggedIn, profile, hasHydrated } = useAuthStore()
  const [isMounted, setIsMounted] = useState<boolean>(false)

  useEffect(() => {
    setIsMounted(true)
    if (!hasHydrated) {
      useAuthStore.persist.rehydrate()
    }
  }, [hasHydrated])

  if (!isMounted) return <div />

  if (!isLoggedIn) return <Landing />
  if (profile?.role === BUSINESS_OWNER) return <Home />
  if (profile?.role === CUSTOMER) redirect('/usuario')
  redirect('/login')
}
