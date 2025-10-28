import { parseCookies } from 'h3'
import { useAuthStore } from '@/stores/auth'

export default defineNuxtRouteMiddleware(async (to) => {
    const auth = useAuthStore()

    // 🧭 1. Se já está autenticado e tenta acessar /login → manda pro dashboard
    if (to.path === '/login' && auth.isAuthenticated) {
        return navigateTo('/dashboard')
    }

    // 🌐 2. No SSR: verifica se o cookie refresh_token existe
    if (import.meta.server) {
        const event = useRequestEvent()
        if (event) {
            const cookies = parseCookies(event)
            const refreshToken = cookies['refresh_token']

            if (!refreshToken && to.path !== '/login') {
                return navigateTo('/login')
            }

            // 🧭 1. Se já está autenticado e tenta acessar /login → manda pro dashboard
            if (to.path === '/login' && refreshToken) {
                return navigateTo('/dashboard')
            }
        }
    }
})
