// services/authService.ts
import type { LoginRequest, LoginResponse } from '@/types/auth'

export const authService = {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const config = useRuntimeConfig()
    return await $fetch<LoginResponse>(`${config.public.apiBaseUrl}/auth/login`, {
      method: 'POST',
      body: payload,
      credentials: 'include',
    })
  },

  async refresh(headers: HeadersInit): Promise<LoginResponse | null> {
    const config = useRuntimeConfig()
    try {
      return await $fetch<LoginResponse>(`${config.public.apiBaseUrl}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers,
      })
    } catch (error) {
      navigateTo('/login')
      return null
    }
  },

  async logout(accessToken: string | null): Promise<void> {
    if (!accessToken) return
    const config = useRuntimeConfig()
    await $fetch(`${config.public.apiBaseUrl}/auth/logout`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
    })
  },
}
