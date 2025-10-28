<script setup lang="ts">
import AppSidebar from '@/components/AppSidebar.vue'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'

import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { LogOut, LogOutIcon } from 'lucide-vue-next'

const auth = useAuthStore()
const showDialog = ref(false)

onMounted(() => {
  if (auth.user_status === 'PENDING_PROFILE_DATA') {
    showDialog.value = true
  }
})
</script>

<template>
  <div v-if="!showDialog">
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header
          class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div class="flex items-center gap-2 px-4">
            <SidebarTrigger class="-ml-1" />
            <Separator orientation="vertical" class="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem class="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator class="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main class="flex-1 w-full">
          <NuxtPage />
        </main>
      </SidebarInset>
    </SidebarProvider>
  </div>
<Dialog 
  v-model:open="showDialog"
  :modal="true"
  @update:open="(val) => { 
    if (!val && auth.user_status !== 'ACTIVE') {
      showDialog = true
    }
  }"
>
  <DialogContent
    class="max-w-5xl w-full sm:max-w-4xl [&>button]:hidden"
  >
    <DialogHeader>
      <DialogTitle>Complete seu cadastro</DialogTitle>
      <DialogDescription>
        Para continuar usando a plataforma, finalize o preenchimento dos seus dados de perfil.
      </DialogDescription>
    </DialogHeader>

      <!-- conteúdo principal -->
      <div class="mt-4">
        <CompleteProfile @completed="showDialog = false" />
      </div>

      <!-- footer / logout -->
      <div class="mt-4 flex justify-end">
        <Button variant="destructive" @click="auth.logout()" size="sm">
          <LogOutIcon class="w-4 h-4 mr-2" /> Sair
        </Button>
      </div>
    </DialogContent>
  </Dialog>

</template>