import { create } from "zustand"
import type { User } from "../types/index.js"

interface AuthStore {
    user: User | null
    isAuthenticated: boolean
    setAuth: (user: User, accessToken: string, refreshToken: string) => void
    logout: () => void
    hydrate: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    isAuthenticated: false,

    hydrate: () => {
        const token = localStorage.getItem("accessToken")
        const userStr = localStorage.getItem("user")
        if(token && userStr) {
            set({ user: JSON.parse(userStr), isAuthenticated: true })
        }
    },

    setAuth: (user, accessToken, refreshToken) => {
        localStorage.setItem("accessToken", accessToken)
        localStorage.setItem("refreshToken", refreshToken)
        localStorage.setItem("user", JSON.stringify(user))
        set({ user, isAuthenticated: true })
    },

    logout: () => {
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("user")
        set({ user: null, isAuthenticated: false })
    },
}))