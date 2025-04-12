import { Session, SignInWithPasswordResponse } from '@/services/types/auth.type'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthStore = {
  session: Session | null
  isLoggedIn: boolean
  setSession: (response: SignInWithPasswordResponse) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      session: null,
      isLoggedIn: false,
      setSession: (response) =>
        set({ session: response.session, isLoggedIn: true }),
      clearSession: () => set({ session: null, isLoggedIn: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        session: state.session,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
)
