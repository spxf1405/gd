<template>
  <div class="min-h-screen bg-[#0B0E1A] text-white">
    <header
      class="fixed top-0 left-0 right-0 h-16 bg-[#0B1224]/95 backdrop-blur-md border-b border-cyan-500/20 z-50 px-4"
    >
      <div class="h-full flex items-center justify-between max-w-full">
        <div class="flex items-center gap-3">
          <button
            @click="toggleSidebar"
            class="lg:hidden p-2 hover:bg-cyan-500/10 rounded-lg transition-colors"
          >
            <Icon icon="lucide:menu" class="w-5 h-5 text-cyan-400" />
          </button>
          <div
            class="w-10 h-10 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/50"
          >
            <Icon icon="lucide:trophy" class="w-5 h-5 text-white" />
          </div>
          <div class="hidden sm:block">
            <div
              class="text-lg font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
            >
              {{ t('app.name') }}
            </div>
            <div class="text-[10px] text-gray-400 uppercase tracking-wider">
              {{ t('app.subtitle') }}
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            class="relative p-2 hover:bg-cyan-500/10 rounded-lg transition-colors hidden md:flex"
          >
            <Icon icon="lucide:bell" class="w-5 h-5 text-gray-300" />
            <span
              v-if="notificationCount > 0"
              class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"
            ></span>
          </button>
          <button
            class="p-2 hover:bg-cyan-500/10 rounded-lg transition-colors hidden md:flex"
          >
            <Icon icon="lucide:star" class="w-5 h-5 text-gray-300" />
          </button>
          <div
            class="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center"
          >
            <Icon icon="lucide:user" class="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </header>

    <aside
      class="hidden lg:block fixed left-0 top-16 bottom-0 w-64 bg-[#0B1224]/50 border-r border-cyan-500/10 z-40"
    >
      <nav class="p-4 space-y-2">
        <NuxtLink
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all group"
          :class="
            $route.path === item.path
              ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-500/30'
              : 'text-gray-400 hover:bg-cyan-500/10 hover:text-white'
          "
        >
          <Icon
            :icon="item.icon"
            class="w-5 h-5 transition-colors"
            :class="$route.path === item.path ? 'text-cyan-400' : 'text-gray-400'"
          />
          <span class="text-sm font-medium">{{ t(item.labelKey) }}</span>
        </NuxtLink>
      </nav>
    </aside>

    <DialogRoot v-model:open="sidebarOpen">
      <DialogPortal>
        <DialogOverlay
          class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden"
        />
        <DialogContent
          class="fixed left-0 top-0 bottom-0 w-80 bg-[#0B1224] border-r border-cyan-500/20 z-50 lg:hidden pt-20 overflow-y-auto"
        >
          <div class="p-4">
            <div
              class="flex items-center gap-3 mb-6 p-4 bg-cyan-500/5 rounded-lg border border-cyan-500/10"
            >
              <div
                class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center"
              >
                <Icon icon="lucide:user" class="w-6 h-6 text-white" />
              </div>
              <div>
                <div class="text-white font-semibold">{{ user.name }}</div>
                <div class="text-gray-400 text-sm">{{ user.title }}</div>
              </div>
            </div>

            <nav class="space-y-2">
              <NuxtLink
                v-for="item in menuItems"
                :key="item.path"
                :to="item.path"
                @click="sidebarOpen = false"
                class="flex items-center gap-3 px-4 py-3 rounded-lg transition-all"
                :class="
                  $route.path === item.path
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-500/30'
                    : 'text-gray-400 hover:bg-cyan-500/10 hover:text-white'
                "
              >
                <Icon
                  :icon="item.icon"
                  class="w-5 h-5"
                  :class="$route.path === item.path ? 'text-cyan-400' : 'text-gray-400'"
                />
                <span class="text-sm font-medium">{{ t(item.labelKey) }}</span>
              </NuxtLink>
            </nav>

            <div class="mt-6 space-y-2">
              <button
                class="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-400 hover:bg-cyan-500/10 hover:text-white transition-all"
              >
                <Icon icon="lucide:bell" class="w-5 h-5" />
                <span class="text-sm">{{ t('layout.notifications') }}</span>
                <span
                  v-if="notificationCount > 0"
                  class="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full"
                >
                  {{ notificationCount }}
                </span>
              </button>
              <button
                class="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-gray-400 hover:bg-cyan-500/10 hover:text-white transition-all"
              >
                <Icon icon="lucide:star" class="w-5 h-5" />
                <span class="text-sm">{{ t('layout.favorites') }}</span>
              </button>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </DialogRoot>

    <main class="lg:ml-64 pt-16 min-h-screen flex flex-col">
      <div class="flex flex-col">
        <div class="flex items-center gap-4 p-4 h-24">
          <div
            class="w-1.5 h-12 bg-gradient-to-b from-cyan-500 to-purple-600 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)]"
          ></div>
          <div>
            <h1
              class="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-cyan-400 to-purple-400 bg-clip-text text-transparent"
            >
              {{ t('layout.pageTitle') }}
            </h1>
            <p
              class="text-[10px] text-gray-500 uppercase text-white tracking-[0.3em] font-bold mt-1 opacity-70"
            >
              {{ t('layout.pageSubtitle') }}
            </p>
          </div>
        </div>
        <div
          class="h-px bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-transparent"
        ></div>
      </div>

      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { Icon } from "@iconify/vue";
import {
  DialogRoot,
  DialogPortal,
  DialogOverlay,
  DialogContent,
} from "radix-vue";

const { t } = useI18n();

const sidebarOpen = ref(false);
const notificationCount = ref(3);

const user = ref({
  name: "Elite Gamer",
  title: "Pro Player",
});

const menuItems = [
  { path: "/admin/tournaments", labelKey: "layout.menu.tournaments", icon: "lucide:trophy" },
  { path: "/admin/ladder",      labelKey: "layout.menu.ladder",      icon: "lucide:layout-dashboard" },
  { path: "/admin/brackets",    labelKey: "layout.menu.brackets",    icon: "lucide:layers" },
  { path: "/admin/players",     labelKey: "layout.menu.players",     icon: "lucide:users" },
  { path: "/admin/archive",     labelKey: "layout.menu.archive",     icon: "lucide:archive" },
  { path: "/admin/settings",    labelKey: "layout.menu.settings",    icon: "lucide:settings" },
];

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const route = useRoute();
watch(
  () => route.path,
  () => { sidebarOpen.value = false; },
);
</script>

<style scoped>
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: rgba(6, 182, 212, 0.05); }
::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(6, 182, 212, 0.6), rgba(139, 92, 246, 0.6));
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, rgba(6, 182, 212, 0.8), rgba(139, 92, 246, 0.8));
}
</style>