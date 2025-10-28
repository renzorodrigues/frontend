// stores/user.ts
import { defineStore } from 'pinia'
import { userService } from '@/services/userService'
import { useAuthStore } from '@/stores/auth'
import type { UserUpdateRequest } from '@/types/user'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoading: false,
    lastUpdated: null as Date | null,
  }),

  actions: {
    async updateUser(payload: UserUpdateRequest) {
      this.isLoading = true
      try {
        const auth = useAuthStore()
        if (!auth.accessToken) throw new Error('Usuário não autenticado')

        const response = await userService.update(payload, auth.accessToken)
        this.lastUpdated = new Date()
        return response
      } finally {
        this.isLoading = false
      }
    },
  },
})
