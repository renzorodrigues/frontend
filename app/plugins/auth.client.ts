import { useAuthStore } from '@/stores/auth'

export default defineNuxtPlugin(async (nuxtApp) => {
  const auth = useAuthStore()

  if (!auth.isAuthenticated) {
    await auth.refresh()
  }
})
