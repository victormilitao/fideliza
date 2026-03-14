'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/useAuthStore'
import { BUSINESS_OWNER } from '@/types/profile'
import { redirect } from 'next/navigation'

export default function BusinessProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isHydrated, setIsHydrated] = useState(false)
  const { isLoggedIn, profile } = useAuthStore()

  useEffect(() => {
    // Check if zustand persist already hydrated
    if (useAuthStore.persist.hasHydrated()) {
      setIsHydrated(true)
      return
    }
    // Otherwise wait for hydration to finish
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setIsHydrated(true)
    })
    return unsub
  }, [])

  if (!isHydrated) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
    </div>
  )

  if (!isLoggedIn || profile?.role !== BUSINESS_OWNER) {
    redirect('/login')
  }

  return <>{children}</>
}
