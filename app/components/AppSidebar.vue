<script setup lang="ts">
import type { SidebarProps } from '@/components/ui/sidebar'

import {
  AudioWaveform,
  Building,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  PlusCircle,
  QrCode,
  Receipt,
  Settings2,
  Users,
} from "lucide-vue-next"
import NavMain from '@/components/NavMain.vue'
import NavProjects from '@/components/NavProjects.vue'
import NavUser from '@/components/NavUser.vue'
import TeamSwitcher from '@/components/TeamSwitcher.vue'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'

const props = withDefaults(defineProps<SidebarProps>(), {
  collapsible: "icon",
})

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "ELDORADO",
      plan: "Enterprise",
    },
    {
      name: "VILA DO SOL",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "MORADA DO BOSQUE",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Condomínios",
      url: "#",
      icon: Building,
      isActive: true,
      items: [
        {
          title: "Adicionar",
          icon: PlusCircle,
          url: "#",
        },
        {
          title: "Configurar",
          icon: Settings2,
          url: "#",
        },
      ],
    },
    {
      title: "Usuários",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Adicionar",
          icon: PlusCircle,
          url: "#",
        },
        {
          title: "Configurar",
          icon: Settings2,
          url: "#",
        },
      ],
    },
    {
      title: "Cobrança",
      url: "#",
      icon: Receipt,
      items: [
        {
          title: "Criar Boleto",
          icon: QrCode,
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}
</script>

<template>
  <Sidebar v-bind="props">
    <SidebarHeader>
      <TeamSwitcher :teams="data.teams" />
    </SidebarHeader>
    <SidebarContent>
      <NavMain :items="data.navMain" />
      <NavProjects :projects="data.projects" />
    </SidebarContent>
    <SidebarFooter>
      <NavUser :user="data.user" />
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
</template>
