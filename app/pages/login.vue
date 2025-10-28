<script setup lang="ts">
import { ref } from 'vue'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const loading = ref(false)
const errorMessage = ref('')
const auth = useAuthStore()
const router = useRouter()
const form = reactive({
  username: '',
  password: '',
})

const handleLogin = async () => {
  try {
    loading.value = true
    const res = await auth.login(form)
    router.push('/dashboard')
    loading.value = false
  } catch (err) {
    errorMessage.value = 'Invalid credentials'
    loading.value = false
  }
}
</script>

<template>
  <div class="w-full p-5 pt-20 px-4">
    <Card class="mx-auto max-w-sm w-full">
      <CardHeader>
        <CardTitle class="text-center text-2xl">
          Login
        </CardTitle>
        <CardDescription>
          Acesse sua conta para continuar.
        </CardDescription>
      </CardHeader>

      <CardContent class="grid gap-4">
        <div class="grid gap-2">
          <Label for="email">Email</Label>
          <Input id="email" type="email" required placeholder="seu@email.com" v-model="form.username" />
        </div>

        <div class="grid gap-2">
          <Label for="password">Senha</Label>
          <Input id="password" type="password" required v-model="form.password" />
        </div>

        <p v-if="errorMessage" class="text-sm text-red-500 mt-2">{{ errorMessage }}</p>
      </CardContent>

      <CardFooter>
        <Button class="w-full" :disabled="loading" @click="handleLogin">
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </Button>
      </CardFooter>
    </Card>
  </div>
</template>
