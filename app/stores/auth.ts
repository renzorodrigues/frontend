import { defineStore } from 'pinia'
import { authService } from '@/services/authService'
import type { LoginRequest, LoginResponse, TokenPayload } from '@/types/auth'

// Função auxiliar para decodificar o payload do JWT
function decodeToken(token: string): TokenPayload | null {
    try {
        const payload = token.split('.')[1] as string
        return JSON.parse(atob(payload))
    } catch {
        return null
    }
}

export const useAuthStore = defineStore('auth', {
    state: () => ({
        accessToken: null as string | null,
        user: null as TokenPayload | null,
        isAuthenticated: false,
        user_status: null as string | null,
        isLoading: false,
    }),

    actions: {
        async login(payload: LoginRequest) {
            this.isLoading = true
            try {
                const response: LoginResponse = await authService.login(payload)
                this.setSession(response)
                return response
            } finally {
                this.isLoading = false
            }
        },

        async refresh() {
            const headers = import.meta.server ? useRequestHeaders(['cookie']) : undefined
            const response = await authService.refresh(headers as HeadersInit)
            if (response) {
                this.setSession(response)
                return response
            }

            this.clearSession()
            return null
        },

        async logout() {
            try {
                await authService.logout(this.accessToken)
            } finally {
                navigateTo('/login')
                this.clearSession()
            }
        },

        setSession(response: LoginResponse) {
            this.accessToken = response.access_token
            const payload = decodeToken(response.access_token)
            this.user = payload
            this.user_status = response.user_status
            this.isAuthenticated = true
        },

        clearSession() {
            this.accessToken = null
            this.user = null
            this.user_status = null
            this.isAuthenticated = false
        },
    },
})
