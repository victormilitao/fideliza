import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AuthStore = {
  accessToken: string | null
  isLoggedIn: boolean
  setAccessToken: (token: string) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      isLoggedIn: false,
      setAccessToken: (accessToken) => set({ accessToken, isLoggedIn: true }),
      clearSession: () => set({ accessToken: null, isLoggedIn: false }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        accessToken: state.accessToken,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
)
