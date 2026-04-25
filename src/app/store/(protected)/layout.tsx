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
  const [mounted, setMounted] = useState(false)
  const { isLoggedIn, profile } = useAuthStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
    </div>
  )

  if (!isLoggedIn || profile?.role !== BUSINESS_OWNER) {
    redirect('/login')
  }

  return <>{children}</>
}
