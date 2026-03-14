import { Session, SignInWithPasswordResponse } from '@/services/types/auth.type'
import { Profile } from '@/types/profile'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthStore = {
  session: Session | null
  isLoggedIn: boolean
  profile: Profile | null
  hasHydrated: boolean
  setSession: (response: SignInWithPasswordResponse) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set): AuthStore => ({
      session: null,
      isLoggedIn: false,
      profile: null,
      hasHydrated: false,
      setSession: (response) =>
        set({ session: response.session, isLoggedIn: true, profile: response.profile }),
      clearSession: () => set({ session: null, isLoggedIn: false, profile: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        session: state.session,
        isLoggedIn: state.isLoggedIn,
        profile: state.profile,
      }),
      onRehydrateStorage: () => () => {
        useAuthStore.setState({ hasHydrated: true })
      },
    }
  )
)
