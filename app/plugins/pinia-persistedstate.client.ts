import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { defineNuxtPlugin } from '#app'
import type { Pinia } from 'pinia'

export default defineNuxtPlugin((nuxtApp) => {
  (nuxtApp.$pinia as Pinia).use(piniaPluginPersistedstate)
})

