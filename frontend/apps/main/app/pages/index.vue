<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { onMounted, onBeforeUnmount } from "vue";

definePageMeta({
  title: "Elite Gamer - Tournament",
  layout: false,
});

useHead({
  title: "Elite Gamer - Tournament",
  link: [
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600&display=swap",
    },
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&display=swap",
    },
  ],
});

const orderByVal = ref("Order By: Relevance");
const orderByOptions = [
  "Order By: Relevance",
  "Order By: Date",
  "Order By: Prize Pool",
];

const toTournamentDetail = () => {
  console.log("toTournamentDetail", 1)
  navigateTo("/tournament/12")
}

onMounted(() => {
  const sidebar = document.getElementById("sidebar");
  const sidebarToggle = document.getElementById("sidebar-toggle");
  const mainContent = document.getElementById("main-content");

  let isCollapsed = false;
  document.documentElement.style.setProperty("--sidebar-width", "256px");

  const toggleSidebar = () => {
    isCollapsed = !isCollapsed;

    if (window.innerWidth <= 1024) {
      // Mobile behavior - show/hide sidebar as overlay
      sidebar?.classList.toggle("show");
    } else {
      // Desktop behavior - collapse/expand sidebar
      if (isCollapsed) {
        document.documentElement.style.setProperty("--sidebar-width", "80px");
        sidebar?.classList.add("collapsed");
      } else {
        document.documentElement.style.setProperty("--sidebar-width", "256px");
        sidebar?.classList.remove("collapsed");
      }
    }
  };

  sidebarToggle?.addEventListener("click", toggleSidebar);

  const handleResize = () => {
    if (window.innerWidth <= 1024) {
      // Mobile mode - hide sidebar by default, show as overlay when toggled
      sidebar?.classList.remove("collapsed");
      sidebar?.classList.remove("show");
      document.documentElement.style.setProperty("--sidebar-width", "0px");
      isCollapsed = false;
    } else {
      // Desktop mode - remove mobile overlay class
      sidebar?.classList.remove("show");
      if (isCollapsed) {
        document.documentElement.style.setProperty("--sidebar-width", "80px");
        sidebar?.classList.add("collapsed");
      } else {
        document.documentElement.style.setProperty("--sidebar-width", "256px");
        sidebar?.classList.remove("collapsed");
      }
    }
  };

  window.addEventListener("resize", handleResize);
  handleResize();

  // Cleanup listeners on unmount
  onBeforeUnmount(() => {
    sidebarToggle?.removeEventListener("click", toggleSidebar);
    window.removeEventListener("resize", handleResize);
  });

  
});

</script>

<template>
  <ClientOnly>
    <body class="bg-dark-bg min-h-screen text-white overflow-x-hidden">
      <!-- Fixed Header -->
      <header
        class="fixed top-0 w-full bg-darker-blue/95 backdrop-blur-md border-b border-accent-blue/20 z-40"
        style="padding-left: var(--sidebar-width, 256px)"
      >
        <div class="flex items-center justify-between px-6 py-3">
          <!-- Left side with sidebar toggle -->
          <div class="flex items-center space-x-4">
            <button
              id="sidebar-toggle"
              class="p-2 hover:bg-accent-blue/20 rounded-lg transition-colors"
            >
              <i class="fas fa-bars text-gray-300 hover:text-white"></i>
            </button>

            <nav class="hidden md:flex items-center space-x-6">
              <a href="#" class="flex items-center space-x-2 text-cyber-green">
                <i class="fas fa-chart-line text-sm"></i>
                <span>Overview</span>
              </a>
              <a
                href="#"
                class="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <i class="fas fa-trophy text-sm"></i>
                <span>Ladder</span>
              </a>
              <a
                href="#"
                class="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
              >
                <i class="fas fa-archive text-sm"></i>
                <span>Archive</span>
              </a>
            </nav>
          </div>

          <!-- Right Side -->
          <div class="flex items-center space-x-4">
            <div class="hidden md:flex items-center space-x-2">
              <SelectRoot defaultValue="relevance" v-model="orderByVal">
                <SelectTrigger
                  class="inline-flex bg-darker-surface items-center gap-2 border border-accent-blue/20 rounded-lg px-3 py-2 text-white text-sm"
                >
                  <SelectValue placeholder="Order By" />
                  <SelectIcon>
                    <Icon icon="radix-icons:chevron-down" class="h-3.5 w-3.5" />
                  </SelectIcon>
                </SelectTrigger>
                <SelectPortal>
                  <SelectContent
                    position="popper"
                    :sideOffset="5"
                    :bodyLock="false"
                    class="bg-darker-surface rounded-lg shadow-lg z-50 cursor-pointer !w-[--radix-select-trigger-width]"
                    style="width: var(--radix-select-trigger-width)"
                  >
                    <SelectViewport>
                      <SelectItem
                        v-for="(option, index) in orderByOptions"
                        :key="index"
                        :value="option"
                        class="px-3 py-2 text-white text-sm rounded-md cursor-pointer border border-transparent hover:bg-dark-blue hover:border-accent-blue/40 focus:bg-dark-blue focus:border-accent-blue/60 transition-colors duration-200 outline-none"
                      >
                        <SelectItemText>
                          {{ option }}
                        </SelectItemText>
                      </SelectItem>
                    </SelectViewport>
                  </SelectContent>
                </SelectPortal>
              </SelectRoot>
              <select
                class="bg-darker-surface border border-accent-blue/20 rounded-lg px-3 py-2 text-white text-sm"
              >
                <option>All Platforms</option>
                <option>PC</option>
                <option>Console</option>
              </select>
              <select
                class="bg-darker-surface border border-accent-blue/20 rounded-lg px-3 py-2 text-white text-sm"
              >
                <option>Region: Europe</option>
                <option>Region: North America</option>
                <option>Region: Asia</option>
              </select>
            </div>

            <div class="hidden md:block">
              <input
                type="text"
                placeholder="Search in tournaments..."
                class="bg-darker-surface border border-accent-blue/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 w-64 focus:border-accent-blue/40 focus:outline-none"
              />
            </div>

            <div class="flex items-center space-x-3">
              <button
                class="p-2 hover:bg-accent-blue/20 rounded-lg transition-colors"
              >
                <i class="fas fa-bell text-gray-300 hover:text-white"></i>
              </button>
              <button
                class="p-2 hover:bg-accent-blue/20 rounded-lg transition-colors"
              >
                <i class="fas fa-star text-gray-300 hover:text-white"></i>
              </button>

              <div class="flex items-center space-x-2">
                <div
                  class="w-8 h-8 bg-gradient-to-br from-cyber-purple to-pink-600 rounded-full flex items-center justify-center"
                >
                  <i class="fas fa-user text-white text-sm"></i>
                </div>
                <span class="hidden lg:inline text-sm">Elite Gamer</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Fixed Sidebar -->
      <aside
        id="sidebar"
        class="fixed left-0 top-0 h-full bg-sidebar-gradient border-r border-accent-blue/20 z-50 transition-all duration-300 shadow-2xl"
        style="width: var(--sidebar-width, 256px)"
      >
        <div class="p-6 h-full flex flex-col">
          <!-- Logo -->
          <div class="flex items-center space-x-3 mb-8 px-2">
            <div
              class="w-10 h-10 bg-gradient-to-br from-accent-blue to-cyber-purple rounded-xl flex items-center justify-center shadow-lg"
            >
              <i class="fas fa-gamepad text-white text-lg"></i>
            </div>
            <div class="sidebar-text">
              <div
                class="text-xl font-bold bg-gradient-to-r from-accent-blue to-cyber-green bg-clip-text text-transparent"
              >
                Elite Gamer
              </div>
              <div class="text-xs text-gray-400">Tournament Platform</div>
            </div>
          </div>

          <!-- Profile Card -->
          <div
            class="bg-gradient-to-br from-dark-surface to-darker-surface rounded-xl p-4 border border-accent-blue/20 mb-6 shadow-lg"
          >
            <div class="flex items-center space-x-3 mb-4">
              <div
                class="w-12 h-12 bg-gradient-to-br from-cyber-purple to-pink-600 rounded-full flex items-center justify-center shadow-lg"
              >
                <i class="fas fa-crown text-white"></i>
              </div>
              <div class="sidebar-text">
                <div class="text-xs text-gray-400">Good morning</div>
                <div class="font-semibold text-white">Elite Gamer</div>
              </div>
            </div>

            <div class="sidebar-text mb-4">
              <div class="text-xs text-gray-400 mb-2">
                Unlock more with Premium membership
              </div>
              <div class="text-xs text-gray-500">
                New games are being released and you don't want to miss out.
              </div>
            </div>

            <button
              class="w-full bg-gradient-to-r from-accent-blue to-cyber-purple hover:from-accent-blue/80 hover:to-cyber-purple/80 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg"
            >
              <span class="sidebar-text">Get Started</span>
              <i class="sidebar-icon fas fa-arrow-right"></i>
            </button>
          </div>

          <!-- Navigation -->
          <nav class="flex-1 space-y-2">
            <div
              class="sidebar-text text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2"
            >
              Navigation
            </div>

            <a
              href="#"
              class="flex items-center space-x-3 p-3 rounded-xl bg-accent-blue/20 text-accent-blue border border-accent-blue/30 shadow-sm group"
            >
              <i class="fas fa-trophy text-lg"></i>
              <div
                class="sidebar-text flex-1 flex items-center justify-between"
              >
                <span class="font-medium">Tournaments</span>
                <span
                  class="bg-accent-blue text-white text-xs px-2 py-1 rounded-full shadow-sm"
                  >12</span
                >
              </div>
            </a>

            <a
              href="#"
              class="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-200 group"
            >
              <i class="fas fa-video text-lg"></i>
              <span class="sidebar-text font-medium">Streams</span>
            </a>

            <a
              href="#"
              class="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-200 group"
            >
              <i class="fas fa-newspaper text-lg"></i>
              <span class="sidebar-text font-medium">Articles</span>
            </a>

            <a
              href="#"
              class="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-200 group"
            >
              <i class="fas fa-shopping-cart text-lg"></i>
              <span class="sidebar-text font-medium">Shop</span>
            </a>

            <a
              href="#"
              class="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-200 group"
            >
              <i class="fas fa-list text-lg"></i>
              <span class="sidebar-text font-medium">Leaderboards</span>
            </a>

            <!-- Configure Section -->
            <div
              class="sidebar-text text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2 pt-6"
            >
              Configure
            </div>

            <a
              href="#"
              class="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-200 group"
            >
              <i class="fas fa-headset text-lg"></i>
              <span class="sidebar-text font-medium">Support</span>
            </a>

            <a
              href="#"
              class="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-200 group"
            >
              <i class="fas fa-cog text-lg"></i>
              <span class="sidebar-text font-medium">Settings</span>
            </a>

            <a
              href="#"
              class="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-200 group"
            >
              <i class="fas fa-crown text-lg"></i>
              <span class="sidebar-text font-medium">Membership</span>
            </a>
          </nav>
        </div>
      </aside>

      <!-- Main Content -->
      <main
        id="main-content"
        class="transition-all duration-300"
        style="margin-left: var(--sidebar-width, 256px); padding-top: 80px"
      >
        <div class="p-6">
          <!-- Hero Section -->
          <div
            class="bg-hero-gradient rounded-2xl p-8 mb-8 relative overflow-hidden border border-accent-blue/20 shadow-2xl"
          >
            <!-- Decorative background elements -->
            <div
              class="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30"
            ></div>
            <div
              class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyber-purple/20 to-transparent rounded-full blur-3xl"
            ></div>
            <div
              class="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent-blue/20 to-transparent rounded-full blur-3xl"
            ></div>

            <div class="relative z-10 flex flex-col lg:flex-row items-center">
              <div class="flex-1 mb-6 lg:mb-0">
                <div class="flex items-center space-x-3 mb-6">
                  <span
                    class="bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-sm font-medium shadow-lg"
                    >345 Members</span
                  >
                  <div class="flex space-x-2">
                    <div
                      class="w-8 h-8 bg-accent-blue/20 backdrop-blur-sm border border-accent-blue/30 rounded-lg flex items-center justify-center"
                    >
                      <i class="fab fa-windows text-accent-blue"></i>
                    </div>
                    <div
                      class="w-8 h-8 bg-accent-blue/20 backdrop-blur-sm border border-accent-blue/30 rounded-lg flex items-center justify-center"
                    >
                      <i class="fab fa-playstation text-accent-blue"></i>
                    </div>
                  </div>
                </div>

                <h1
                  class="text-4xl lg:text-6xl font-bold mb-6 leading-tight"
                  style="
                    font-family: Orbitron, sans-serif;
                    letter-spacing: -0.02em;
                    color: #ffffff;
                  "
                >
                  COMPETE IN<br />
                  <span
                    class="bg-gradient-to-r from-cyber-green to-accent-blue bg-clip-text text-transparent"
                    style="
                      font-family: Orbitron, sans-serif;
                      letter-spacing: -0.02em;
                    "
                    >YOUR FAVOURITE GAMES</span
                  >
                </h1>
                <p class="text-gray-300 mb-8 max-w-md text-lg">
                  Compete in epic tournaments on Elite Gamers Arena.
                </p>

                <div class="flex items-center space-x-12 mb-8">
                  <div class="text-center">
                    <div
                      class="text-3xl font-bold text-cyber-green flex items-center justify-center mb-2"
                    >
                      <i class="fas fa-gamepad mr-3 text-2xl"></i>3,200
                    </div>
                    <div class="text-sm text-gray-400 font-medium">
                      Matches played
                    </div>
                  </div>
                  <div class="text-center">
                    <div
                      class="text-3xl font-bold text-accent-blue flex items-center justify-center mb-2"
                    >
                      <i class="fas fa-trophy mr-3 text-2xl"></i>235
                    </div>
                    <div class="text-sm text-gray-400 font-medium">
                      Tournaments held
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex-shrink-0">
                <div class="flex items-center space-x-6">
                  <div
                    class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center shadow-xl"
                  >
                    <div class="text-3xl font-bold mb-1">565</div>
                    <div class="text-xs text-gray-400">Active Players</div>
                  </div>
                  <div class="flex flex-col space-y-3">
                    <div
                      class="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-500 rounded-full shadow-lg border-2 border-white/20"
                    ></div>
                    <div
                      class="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full shadow-lg border-2 border-white/20"
                    ></div>
                    <div
                      class="w-14 h-14 bg-gradient-to-br from-pink-500 to-red-500 rounded-full shadow-lg border-2 border-white/20"
                    ></div>
                    <div
                      class="w-14 h-14 bg-gradient-to-br from-green-500 to-blue-500 rounded-full shadow-lg border-2 border-white/20"
                    ></div>
                    <div
                      class="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-lg border-2 border-white/20"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mb-8">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="text-3xl font-bold mb-2">FEATURED TOURNAMENTS</h2>
                <p class="text-gray-400">
                  Participate in contests and win prizes
                </p>
              </div>
              <button
                class="bg-gradient-to-r from-accent-blue to-cyber-purple px-6 py-2 rounded-xl font-medium hover:from-accent-blue/80 hover:to-cyber-purple/80 transition-all duration-200 shadow-lg"
              >
                View All
              </button>
            </div>

            <div
              class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6"
            >
              <!-- Tournament Card 1 -->
              <div
                class="bg-card-gradient rounded-2xl border border-accent-blue/20 overflow-hidden group hover:border-accent-blue/40 hover:shadow-2xl hover:shadow-accent-blue/10 transition-all duration-300 hover:-translate-y-2"
              >
                <div class="relative">
                  <div
                    class="h-48 bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800 flex items-center justify-center relative overflow-hidden"
                  >
                    <div
                      class="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent"
                    ></div>
                    <i
                      class="fas fa-sword text-5xl text-white relative z-10 drop-shadow-lg"
                    ></i>
                    <div
                      class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
                    ></div>
                  </div>
                  <div
                    class="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg text-sm border border-white/20"
                  >
                    <i class="fas fa-clock mr-2 text-cyber-green"></i>07:45:52
                  </div>
                  <div
                    class="absolute top-4 right-4 bg-purple-600/80 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-semibold border border-purple-400/30"
                  >
                    League
                  </div>
                </div>
                <div class="p-6">
                  <h3 class="font-bold text-xl mb-3">Winter 2025 Tournament</h3>
                  <p class="text-gray-400 text-sm mb-6 line-clamp-2">
                    Compete with your friends in this winter season themed
                    championship.
                  </p>
                  <div class="flex items-center justify-between mb-6">
                    <div
                      class="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-4 py-2 rounded-lg font-bold text-sm shadow-lg"
                    >
                      12,500 pts 💰
                    </div>
                    <button
                      @click="toTournamentDetail"
                      class="bg-gradient-to-r from-accent-blue to-cyan-500 hover:from-accent-blue/80 hover:to-cyan-500/80 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg"
                    >
                      Join Tournament
                    </button>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex -space-x-2">
                      <div
                        class="w-8 h-8 bg-violet-500 rounded-full border-2 border-darker-blue shadow-sm"
                      ></div>
                      <div
                        class="w-8 h-8 bg-amber-500 rounded-full border-2 border-darker-blue shadow-sm"
                      ></div>
                      <div
                        class="w-8 h-8 bg-rose-500 rounded-full border-2 border-darker-blue shadow-sm"
                      ></div>
                      <div
                        class="w-8 h-8 bg-sky-500 rounded-full border-2 border-darker-blue shadow-sm"
                      ></div>
                    </div>
                    <span class="text-sm text-gray-400 font-medium"
                      >23/40 Slots</span
                    >
                  </div>
                </div>
              </div>

              <!-- Tournament Card 2 -->
              <div
                class="bg-card-gradient rounded-2xl border border-red-500/20 overflow-hidden group hover:border-red-500/40 hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-300 hover:-translate-y-2"
              >
                <div class="relative">
                  <div
                    class="h-48 bg-gradient-to-br from-red-600 via-orange-600 to-red-800 flex items-center justify-center relative overflow-hidden"
                  >
                    <div
                      class="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent"
                    ></div>
                    <i
                      class="fas fa-shield-alt text-5xl text-white relative z-10 drop-shadow-lg"
                    ></i>
                    <div
                      class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
                    ></div>
                  </div>
                  <div
                    class="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg text-sm border border-white/20"
                  >
                    <i class="fas fa-clock mr-2 text-cyber-green"></i>12:23:15
                  </div>
                  <div
                    class="absolute top-4 right-4 bg-red-600/80 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-semibold border border-red-400/30"
                  >
                    Championship
                  </div>
                </div>
                <div class="p-6">
                  <h3 class="font-bold text-xl mb-3">Fire Warriors Cup</h3>
                  <p class="text-gray-400 text-sm mb-6 line-clamp-2">
                    Battle in the flames and prove your warrior spirit in this
                    intense competition.
                  </p>
                  <div class="flex items-center justify-between mb-6">
                    <div
                      class="bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg"
                    >
                      8,750 pts 🔥
                    </div>
                    <button
                      class="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-500/80 hover:to-orange-500/80 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg"
                    >
                      Join Tournament
                    </button>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex -space-x-2">
                      <div
                        class="w-8 h-8 bg-red-500 rounded-full border-2 border-darker-blue shadow-sm"
                      ></div>
                      <div
                        class="w-8 h-8 bg-orange-500 rounded-full border-2 border-darker-blue shadow-sm"
                      ></div>
                      <div
                        class="w-8 h-8 bg-yellow-500 rounded-full border-2 border-darker-blue shadow-sm"
                      ></div>
                    </div>
                    <span class="text-sm text-gray-400 font-medium"
                      >18/30 Slots</span
                    >
                  </div>
                </div>
              </div>

              <!-- Tournament Card 3 -->
              <div
                class="bg-card-gradient rounded-2xl border border-green-500/20 overflow-hidden group hover:border-green-500/40 hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-300 hover:-translate-y-2"
              >
                <div class="relative">
                  <div
                    class="h-48 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 flex items-center justify-center relative overflow-hidden"
                  >
                    <div
                      class="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent"
                    ></div>
                    <i
                      class="fas fa-leaf text-5xl text-white relative z-10 drop-shadow-lg"
                    ></i>
                    <div
                      class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
                    ></div>
                  </div>
                  <div
                    class="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg text-sm border border-white/20"
                  >
                    <i class="fas fa-clock mr-2 text-cyber-green"></i>03:12:44
                  </div>
                  <div
                    class="absolute top-4 right-4 bg-green-600/80 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-semibold border border-green-400/30"
                  >
                    Eco League
                  </div>
                </div>
                <div class="p-6">
                  <h3 class="font-bold text-xl mb-3">Nature's Guardian</h3>
                  <p class="text-gray-400 text-sm mb-6 line-clamp-2">
                    Protect the environment and showcase your eco-friendly
                    gaming skills.
                  </p>
                  <div class="flex items-center justify-between mb-6">
                    <div
                      class="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg"
                    >
                      15,200 pts 🌿
                    </div>
                    <button
                      class="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-500/80 hover:to-emerald-500/80 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg"
                    >
                      Join Tournament
                    </button>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex -space-x-2">
                      <div
                        class="w-8 h-8 bg-green-500 rounded-full border-2 border-darker-blue shadow-sm"
                      ></div>
                      <div
                        class="w-8 h-8 bg-emerald-500 rounded-full border-2 border-darker-blue shadow-sm"
                      ></div>
                      <div
                        class="w-8 h-8 bg-teal-500 rounded-full border-2 border-darker-blue shadow-sm"
                      ></div>
                      <div
                        class="w-8 h-8 bg-lime-500 rounded-full border-2 border-darker-blue shadow-sm"
                      ></div>
                      <div
                        class="w-8 h-8 bg-cyan-500 rounded-full border-2 border-darker-blue shadow-sm"
                      ></div>
                    </div>
                    <span class="text-sm text-gray-400 font-medium"
                      >35/50 Slots</span
                    >
                  </div>
                </div>
              </div>

              <!-- Tournament Card 4 -->
              <div
                class="bg-card-gradient rounded-2xl border border-pink-500/20 overflow-hidden group hover:border-pink-500/40 hover:shadow-2xl hover:shadow-pink-500/10 transition-all duration-300 hover:-translate-y-2"
              >
                <div class="relative">
                  <div
                    class="h-48 bg-gradient-to-br from-pink-600 via-rose-600 to-purple-700 flex items-center justify-center relative overflow-hidden"
                  >
                    <div
                      class="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent"
                    ></div>
                    <i
                      class="fas fa-heart text-5xl text-white relative z-10 drop-shadow-lg"
                    ></i>
                    <div
                      class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
                    ></div>
                  </div>
                  <div
                    class="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg text-sm border border-white/20"
                  >
                    <i class="fas fa-clock mr-2 text-cyber-green"></i>01:55:30
                  </div>
                  <div
                    class="absolute top-4 right-4 bg-pink-600/80 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-semibold border border-pink-400/30"
                  >
                    Special
                  </div>
                </div>
                <div class="p-6">
                  <h3 class="font-bold text-xl mb-3">Love & Gaming</h3>
                  <p class="text-gray-400 text-sm mb-6 line-clamp-2">
                    A special Valentine's themed tournament for couples and
                    gaming enthusiasts.
                  </p>
                  <div class="flex items-center justify-between mb-6">
                    <div
                      class="bg-gradient-to-r from-pink-400 to-rose-500 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg"
                    >
                      9,999 pts 💕
                    </div>
                    <button
                      class="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-500/80 hover:to-rose-500/80 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg"
                    >
                      Join Tournament
                    </button>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex -space-x-2">
                      <div
                        class="w-8 h-8 bg-pink-500 rounded-full border-2 border-darker-blue shadow-sm"
                      ></div>
                      <div
                        class="w-8 h-8 bg-rose-500 rounded-full border-2 border-darker-blue shadow-sm"
                      ></div>
                    </div>
                    <span class="text-sm text-gray-400 font-medium"
                      >14/20 Slots</span
                    >
                  </div>
                </div>
              </div>

              <!-- Tournament Card 5 -->
              <div
                class="bg-card-gradient rounded-2xl border border-indigo-500/20 overflow-hidden group hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 hover:-translate-y-2"
              >
                <div class="relative">
                  <div
                    class="h-48 bg-gradient-to-br from-indigo-600 via-blue-700 to-purple-800 flex items-center justify-center relative overflow-hidden"
                  >
                    <div
                      class="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent"
                    ></div>
                    <i
                      class="fas fa-star text-5xl text-white relative z-10 drop-shadow-lg"
                    ></i>
                    <div
                      class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
                    ></div>
                  </div>
                  <div
                    class="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg text-sm border border-white/20"
                  >
                    <i class="fas fa-clock mr-2 text-cyber-green"></i>05:30:18
                  </div>
                  <div
                    class="absolute top-4 right-4 bg-indigo-600/80 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-semibold border border-indigo-400/30"
                  >
                    Elite
                  </div>
                </div>
                <div class="p-6">
                  <h3 class="font-bold text-xl mb-3">Stellar Champions</h3>
                  <p class="text-gray-400 text-sm mb-6 line-clamp-2">
                    Reach for the stars in this cosmic gaming championship for
                    elite players.
                  </p>
                  <div class="flex items-center justify-between mb-6">
                    <div
                      class="bg-gradient-to-r from-indigo-400 to-purple-500 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg"
                    >
                      25,000 pts ⭐
                    </div>
                    <button
                      class="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-500/80 hover:to-purple-600/80 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg"
                    >
                      Join Tournament
                    </button>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex -space-x-2">
                      <div
                        class="w-8 h-8 bg-indigo-500 rounded-full border-2 border-darker-blue shadow-sm"
                      ></div>
                      <div
                        class="w-8 h-8 bg-purple-500 rounded-full border-2 border-darker-blue shadow-sm"
                      ></div>
                      <div
                        class="w-8 h-8 bg-blue-500 rounded-full border-2 border-darker-blue shadow-sm"
                      ></div>
                    </div>
                    <span class="text-sm text-gray-400 font-medium"
                      >8/15 Slots</span
                    >
                  </div>
                </div>
              </div>

              <!-- Tournament Card 6 -->
              <div
                class="bg-card-gradient rounded-2xl border border-amber-500/20 overflow-hidden group hover:border-amber-500/40 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 hover:-translate-y-2"
              >
                <div class="relative">
                  <div
                    class="h-48 bg-gradient-to-br from-amber-600 via-yellow-600 to-orange-700 flex items-center justify-center relative overflow-hidden"
                  >
                    <div
                      class="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent"
                    ></div>
                    <i
                      class="fas fa-crown text-5xl text-white relative z-10 drop-shadow-lg"
                    ></i>
                    <div
                      class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
                    ></div>
                  </div>
                  <div
                    class="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg text-sm border border-white/20"
                  >
                    <i class="fas fa-clock mr-2 text-cyber-green"></i>09:15:42
                  </div>
                  <div
                    class="absolute top-4 right-4 bg-amber-600/80 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-semibold border border-amber-400/30"
                  >
                    Royal
                  </div>
                </div>
                <div class="p-6">
                  <h3 class="font-bold text-xl mb-3">Golden Throne</h3>
                  <p class="text-gray-400 text-sm mb-6 line-clamp-2">
                    Claim your rightful place on the golden throne in this royal
                    tournament.
                  </p>
                  <div class="flex items-center justify-between mb-6">
                    <div
                      class="bg-gradient-to-r from-amber-400 to-yellow-500 text-black px-4 py-2 rounded-lg font-bold text-sm shadow-lg"
                    >
                      20,000 pts 👑
                    </div>
                    <button
                      class="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-500/80 hover:to-yellow-500/80 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg text-black"
                    >
                      Join Tournament
                    </button>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex -space-x-2">
                      <div
                        class="w-8 h-8 bg-amber-500 rounded-full border-2 border-darker-blue shadow-sm"
                      ></div>
                      <div
                        class="w-8 h-8 bg-yellow-500 rounded-full border-2 border-darker-blue shadow-sm"
                      ></div>
                      <div
                        class="w-8 h-8 bg-orange-500 rounded-full border-2 border-darker-blue shadow-sm"
                      ></div>
                      <div
                        class="w-8 h-8 bg-red-500 rounded-full border-2 border-darker-blue shadow-sm"
                      ></div>
                    </div>
                    <span class="text-sm text-gray-400 font-medium"
                      >12/25 Slots</span
                    >
                  </div>
                </div>
              </div>

              <!-- Tournament Card 7 -->
              <div
                class="bg-card-gradient rounded-2xl border border-teal-500/20 overflow-hidden group hover:border-teal-500/40 hover:shadow-2xl hover:shadow-teal-500/10 transition-all duration-300 hover:-translate-y-2"
              >
                <div class="relative">
                  <div
                    class="h-48 bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-700 flex items-center justify-center relative overflow-hidden"
                  >
                    <div
                      class="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent"
                    ></div>
                    <i
                      class="fas fa-water text-5xl text-white relative z-10 drop-shadow-lg"
                    ></i>
                    <div
                      class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
                    ></div>
                  </div>
                  <div
                    class="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg text-sm border border-white/20"
                  >
                    <i class="fas fa-clock mr-2 text-cyber-green"></i>02:48:33
                  </div>
                  <div
                    class="absolute top-4 right-4 bg-teal-600/80 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-semibold border border-teal-400/30"
                  >
                    Oceanic
                  </div>
                </div>
                <div class="p-6">
                  <h3 class="font-bold text-xl mb-3">Deep Sea Masters</h3>
                  <p class="text-gray-400 text-sm mb-6 line-clamp-2">
                    Dive into the depths of competition in this underwater
                    themed tournament.
                  </p>
                  <div class="flex items-center justify-between mb-6">
                    <div
                      class="bg-gradient-to-r from-teal-400 to-cyan-500 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg"
                    >
                      16,800 pts 🌊
                    </div>
                    <button
                      class="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-500/80 hover:to-cyan-500/80 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg"
                    >
                      Join Tournament
                    </button>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex -space-x-2">
                      <div
                        class="w-8 h-8 bg-teal-500 rounded-full border-2 border-darker-blue shadow-sm"
                      ></div>
                      <div
                        class="w-8 h-8 bg-cyan-500 rounded-full border-2 border-darker-blue shadow-sm"
                      ></div>
                      <div
                        class="w-8 h-8 bg-blue-500 rounded-full border-2 border-darker-blue shadow-sm"
                      ></div>
                      <div
                        class="w-8 h-8 bg-indigo-500 rounded-full border-2 border-darker-blue shadow-sm"
                      ></div>
                      <div
                        class="w-8 h-8 bg-purple-500 rounded-full border-2 border-darker-blue shadow-sm"
                      ></div>
                    </div>
                    <span class="text-sm text-gray-400 font-medium"
                      >27/35 Slots</span
                    >
                  </div>
                </div>
              </div>

              <!-- Tournament Card 8 -->
              <div
                class="bg-card-gradient rounded-2xl border border-violet-500/20 overflow-hidden group hover:border-violet-500/40 hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-300 hover:-translate-y-2"
              >
                <div class="relative">
                  <div
                    class="h-48 bg-gradient-to-br from-violet-600 via-purple-700 to-fuchsia-800 flex items-center justify-center relative overflow-hidden"
                  >
                    <div
                      class="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent"
                    ></div>
                    <i
                      class="fas fa-magic text-5xl text-white relative z-10 drop-shadow-lg"
                    ></i>
                    <div
                      class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
                    ></div>
                  </div>
                  <div
                    class="absolute top-4 left-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg text-sm border border-white/20"
                  >
                    <i class="fas fa-clock mr-2 text-cyber-green"></i>11:07:25
                  </div>
                  <div
                    class="absolute top-4 right-4 bg-violet-600/80 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-semibold border border-violet-400/30"
                  >
                    Mystic
                  </div>
                </div>
                <div class="p-6">
                  <h3 class="font-bold text-xl mb-3">Arcane Legends</h3>
                  <p class="text-gray-400 text-sm mb-6 line-clamp-2">
                    Master the mystical arts and become a legend in this magical
                    tournament.
                  </p>
                  <div class="flex items-center justify-between mb-6">
                    <div
                      class="bg-gradient-to-r from-violet-400 to-fuchsia-500 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg"
                    >
                      18,750 pts ✨
                    </div>
                    <button
                      class="bg-gradient-to-r from-violet-500 to-fuchsia-600 hover:from-violet-500/80 hover:to-fuchsia-600/80 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg"
                    >
                      Join Tournament
                    </button>
                  </div>
                  <div class="flex items-center justify-between">
                    <div class="flex -space-x-2">
                      <div
                        class="w-8 h-8 bg-violet-500 rounded-full border-2 border-darker-blue shadow-sm"
                      ></div>
                      <div
                        class="w-8 h-8 bg-purple-500 rounded-full border-2 border-darker-blue shadow-sm"
                      ></div>
                      <div
                        class="w-8 h-8 bg-fuchsia-500 rounded-full border-2 border-darker-blue shadow-sm"
                      ></div>
                      <div
                        class="w-8 h-8 bg-pink-500 rounded-full border-2 border-darker-blue shadow-sm"
                      ></div>
                      <div
                        class="w-8 h-8 bg-rose-500 rounded-full border-2 border-darker-blue shadow-sm"
                      ></div>
                      <div
                        class="w-8 h-8 bg-red-500 rounded-full border-2 border-darker-blue shadow-sm"
                      ></div>
                    </div>
                    <span class="text-sm text-gray-400 font-medium"
                      >42/60 Slots</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- FontAwesome for icons -->
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
          />

          <!-- Additional Content Section -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <!-- Premium Membership Card -->
            <div
              class="lg:col-span-2 bg-gradient-to-r from-cyber-purple/20 via-accent-blue/20 to-cyber-green/20 border border-accent-blue/30 rounded-2xl p-8 relative overflow-hidden"
            >
              <div
                class="absolute inset-0 bg-gradient-to-br from-cyber-purple/10 to-accent-blue/10"
              ></div>
              <div class="relative z-10">
                <div class="flex items-center space-x-3 mb-4">
                  <i class="fas fa-crown text-2xl text-cyber-green"></i>
                  <h3 class="text-2xl font-bold">Unlock Premium Features</h3>
                </div>
                <p class="text-gray-300 mb-6 text-lg">
                  Get access to exclusive tournaments, advanced statistics, and
                  premium rewards.
                </p>
                <div class="flex flex-wrap gap-4 mb-6">
                  <div class="flex items-center space-x-2 text-sm">
                    <i class="fas fa-check text-cyber-green"></i>
                    <span>Exclusive Tournaments</span>
                  </div>
                  <div class="flex items-center space-x-2 text-sm">
                    <i class="fas fa-check text-cyber-green"></i>
                    <span>Advanced Analytics</span>
                  </div>
                  <div class="flex items-center space-x-2 text-sm">
                    <i class="fas fa-check text-cyber-green"></i>
                    <span>Priority Support</span>
                  </div>
                </div>
                <button
                  class="bg-gradient-to-r from-cyber-green to-accent-blue hover:from-cyber-green/80 hover:to-accent-blue/80 px-6 py-3 rounded-xl font-semibold text-black transition-all duration-200 shadow-lg"
                >
                  Upgrade Now
                </button>
              </div>
            </div>

            <!-- Statistics Card -->
            <div
              class="bg-card-gradient border border-accent-blue/20 rounded-2xl p-6"
            >
              <h3 class="text-xl font-bold mb-4">Your Stats</h3>
              <div class="space-y-4">
                <div class="flex justify-between items-center">
                  <span class="text-gray-400">Tournaments Won</span>
                  <span class="text-cyber-green font-bold">12</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-400">Total Matches</span>
                  <span class="text-white font-bold">148</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-400">Win Rate</span>
                  <span class="text-accent-blue font-bold">73%</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-gray-400">Current Rank</span>
                  <span class="text-cyber-purple font-bold">#247</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div
            class="bg-card-gradient border border-accent-blue/20 rounded-2xl p-6 mb-8"
          >
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-xl font-bold">Recent Activity</h3>
              <button
                class="text-accent-blue hover:text-accent-blue/80 text-sm font-medium"
              >
                View All
              </button>
            </div>
            <div class="space-y-4">
              <div
                class="flex items-center space-x-4 p-4 bg-darker-surface/50 rounded-xl border border-accent-blue/10 hover:border-accent-blue/20 transition-all duration-200"
              >
                <div
                  class="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg"
                >
                  <i class="fas fa-trophy text-white"></i>
                </div>
                <div class="flex-1">
                  <div class="font-medium">Won Winter Championship</div>
                  <div class="text-sm text-gray-400">
                    2 hours ago • Fortnite Tournament
                  </div>
                </div>
                <div class="text-cyber-green text-sm font-medium">
                  +1,500 pts
                </div>
              </div>

              <div
                class="flex items-center space-x-4 p-4 bg-darker-surface/50 rounded-xl border border-accent-blue/10 hover:border-accent-blue/20 transition-all duration-200"
              >
                <div
                  class="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center shadow-lg"
                >
                  <i class="fas fa-gamepad text-white"></i>
                </div>
                <div class="flex-1">
                  <div class="font-medium">Joined Valorant Tournament</div>
                  <div class="text-sm text-gray-400">
                    5 hours ago • 32 players registered
                  </div>
                </div>
                <div
                  class="text-accent-blue text-xs bg-accent-blue/20 px-2 py-1 rounded-full"
                >
                  Active
                </div>
              </div>

              <div
                class="flex items-center space-x-4 p-4 bg-darker-surface/50 rounded-xl border border-accent-blue/10 hover:border-accent-blue/20 transition-all duration-200"
              >
                <div
                  class="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg"
                >
                  <i class="fas fa-star text-white"></i>
                </div>
                <div class="flex-1">
                  <div class="font-medium">Achieved Gold Rank</div>
                  <div class="text-sm text-gray-400">
                    1 day ago • Global Leaderboard
                  </div>
                </div>
                <div class="text-yellow-400 text-sm font-medium">Rank #247</div>
              </div>

              <div
                class="flex items-center space-x-4 p-4 bg-darker-surface/50 rounded-xl border border-accent-blue/10 hover:border-accent-blue/20 transition-all duration-200"
              >
                <div
                  class="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg"
                >
                  <i class="fas fa-medal text-white"></i>
                </div>
                <div class="flex-1">
                  <div class="font-medium">Completed Weekly Challenge</div>
                  <div class="text-sm text-gray-400">
                    2 days ago • Win 5 matches
                  </div>
                </div>
                <div class="text-cyber-green text-sm font-medium">+250 pts</div>
              </div>
            </div>
          </div>

          <!-- Upcoming Tournaments Section -->
          <div class="mb-8">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="text-2xl font-bold mb-2">UPCOMING TOURNAMENTS</h2>
                <p class="text-gray-400">
                  Don't miss these exciting competitions
                </p>
              </div>
              <select
                class="bg-darker-surface border border-accent-blue/20 rounded-lg px-4 py-2 text-white text-sm"
              >
                <option>This Week</option>
                <option>This Month</option>
                <option>All Upcoming</option>
              </select>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Upcoming Tournament 1 -->
              <div
                class="bg-card-gradient rounded-xl border border-accent-blue/20 p-6 hover:border-accent-blue/40 transition-all duration-300"
              >
                <div class="flex items-start justify-between mb-4">
                  <div>
                    <h3 class="font-bold text-lg mb-2">
                      League of Legends Championship
                    </h3>
                    <div
                      class="flex items-center space-x-4 text-sm text-gray-400"
                    >
                      <span class="flex items-center"
                        ><i class="fas fa-calendar mr-2"></i>Dec 15, 2024</span
                      >
                      <span class="flex items-center"
                        ><i class="fas fa-clock mr-2"></i>18:00 UTC</span
                      >
                    </div>
                  </div>
                  <div
                    class="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-lg text-sm font-semibold"
                  >
                    League
                  </div>
                </div>

                <div class="flex items-center justify-between mb-4">
                  <div class="text-2xl font-bold text-yellow-400">
                    25,000 pts
                  </div>
                  <div class="text-sm text-gray-400">Prize Pool</div>
                </div>

                <div class="flex items-center justify-between mb-4">
                  <div class="flex -space-x-2">
                    <div
                      class="w-6 h-6 bg-blue-500 rounded-full border-2 border-darker-blue"
                    ></div>
                    <div
                      class="w-6 h-6 bg-red-500 rounded-full border-2 border-darker-blue"
                    ></div>
                    <div
                      class="w-6 h-6 bg-green-500 rounded-full border-2 border-darker-blue"
                    ></div>
                    <span class="ml-2 text-sm text-gray-400">+47 more</span>
                  </div>
                  <span class="text-sm text-gray-400">50/64 slots</span>
                </div>

                <button
                  class="w-full bg-gradient-to-r from-accent-blue to-cyan-500 hover:from-accent-blue/80 hover:to-cyan-500/80 px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg"
                >
                  Register Now
                </button>
              </div>

              <!-- Upcoming Tournament 2 -->
              <div
                class="bg-card-gradient rounded-xl border border-accent-blue/20 p-6 hover:border-accent-blue/40 transition-all duration-300"
              >
                <div class="flex items-start justify-between mb-4">
                  <div>
                    <h3 class="font-bold text-lg mb-2">CS2 Winter Cup</h3>
                    <div
                      class="flex items-center space-x-4 text-sm text-gray-400"
                    >
                      <span class="flex items-center"
                        ><i class="fas fa-calendar mr-2"></i>Dec 18, 2024</span
                      >
                      <span class="flex items-center"
                        ><i class="fas fa-clock mr-2"></i>20:00 UTC</span
                      >
                    </div>
                  </div>
                  <div
                    class="bg-orange-600/20 text-orange-400 px-3 py-1 rounded-lg text-sm font-semibold"
                  >
                    CS2
                  </div>
                </div>

                <div class="flex items-center justify-between mb-4">
                  <div class="text-2xl font-bold text-yellow-400">
                    15,000 pts
                  </div>
                  <div class="text-sm text-gray-400">Prize Pool</div>
                </div>

                <div class="flex items-center justify-between mb-4">
                  <div class="flex -space-x-2">
                    <div
                      class="w-6 h-6 bg-purple-500 rounded-full border-2 border-darker-blue"
                    ></div>
                    <div
                      class="w-6 h-6 bg-pink-500 rounded-full border-2 border-darker-blue"
                    ></div>
                    <div
                      class="w-6 h-6 bg-cyan-500 rounded-full border-2 border-darker-blue"
                    ></div>
                    <span class="ml-2 text-sm text-gray-400">+21 more</span>
                  </div>
                  <span class="text-sm text-gray-400">24/32 slots</span>
                </div>

                <button
                  class="w-full bg-gradient-to-r from-accent-blue to-cyan-500 hover:from-accent-blue/80 hover:to-cyan-500/80 px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg"
                >
                  Register Now
                </button>
              </div>
            </div>
          </div>

          <!-- Leaderboard Section -->
          <div class="mb-8">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="text-2xl font-bold mb-2">TOP PLAYERS</h2>
                <p class="text-gray-400">Global leaderboard rankings</p>
              </div>
              <div class="flex space-x-2">
                <button
                  class="bg-accent-blue text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Weekly
                </button>
                <button
                  class="bg-darker-surface text-gray-400 hover:text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Monthly
                </button>
                <button
                  class="bg-darker-surface text-gray-400 hover:text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  All Time
                </button>
              </div>
            </div>

            <div
              class="bg-card-gradient rounded-xl border border-accent-blue/20 overflow-hidden"
            >
              <div
                class="grid grid-cols-5 gap-4 p-4 bg-darker-surface/30 border-b border-accent-blue/10 text-sm font-semibold text-gray-400"
              >
                <div>Rank</div>
                <div>Player</div>
                <div>Points</div>
                <div>Tournaments</div>
                <div>Win Rate</div>
              </div>

              <div class="divide-y divide-accent-blue/10">
                <div
                  class="grid grid-cols-5 gap-4 p-4 hover:bg-accent-blue/5 transition-colors"
                >
                  <div class="flex items-center space-x-2">
                    <div
                      class="w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded text-black text-xs font-bold flex items-center justify-center"
                    >
                      1
                    </div>
                  </div>
                  <div class="flex items-center space-x-3">
                    <div
                      class="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full"
                    ></div>
                    <span class="font-medium">ProGamer_X</span>
                  </div>
                  <div class="flex items-center text-cyber-green font-bold">
                    45,280
                  </div>
                  <div class="flex items-center">23</div>
                  <div class="flex items-center">89%</div>
                </div>

                <div
                  class="grid grid-cols-5 gap-4 p-4 hover:bg-accent-blue/5 transition-colors"
                >
                  <div class="flex items-center space-x-2">
                    <div
                      class="w-6 h-6 bg-gradient-to-r from-gray-300 to-gray-400 rounded text-black text-xs font-bold flex items-center justify-center"
                    >
                      2
                    </div>
                  </div>
                  <div class="flex items-center space-x-3">
                    <div
                      class="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full"
                    ></div>
                    <span class="font-medium">SkillMaster</span>
                  </div>
                  <div class="flex items-center text-cyber-green font-bold">
                    42,150
                  </div>
                  <div class="flex items-center">19</div>
                  <div class="flex items-center">84%</div>
                </div>

                <div
                  class="grid grid-cols-5 gap-4 p-4 hover:bg-accent-blue/5 transition-colors"
                >
                  <div class="flex items-center space-x-2">
                    <div
                      class="w-6 h-6 bg-gradient-to-r from-orange-400 to-orange-600 rounded text-black text-xs font-bold flex items-center justify-center"
                    >
                      3
                    </div>
                  </div>
                  <div class="flex items-center space-x-3">
                    <div
                      class="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full"
                    ></div>
                    <span class="font-medium">Champion_2024</span>
                  </div>
                  <div class="flex items-center text-cyber-green font-bold">
                    38,920
                  </div>
                  <div class="flex items-center">21</div>
                  <div class="flex items-center">76%</div>
                </div>

                <div
                  class="grid grid-cols-5 gap-4 p-4 hover:bg-accent-blue/5 transition-colors bg-accent-blue/10"
                >
                  <div class="flex items-center space-x-2">
                    <div
                      class="w-6 h-6 bg-gradient-to-r from-accent-blue to-cyan-500 rounded text-white text-xs font-bold flex items-center justify-center"
                    >
                      247
                    </div>
                  </div>
                  <div class="flex items-center space-x-3">
                    <div
                      class="w-8 h-8 bg-gradient-to-br from-cyber-purple to-pink-600 rounded-full"
                    ></div>
                    <span class="font-medium">Elite Gamer (You)</span>
                    <i class="fas fa-crown text-cyber-green text-xs"></i>
                  </div>
                  <div class="flex items-center text-cyber-green font-bold">
                    18,450
                  </div>
                  <div class="flex items-center">12</div>
                  <div class="flex items-center">73%</div>
                </div>
              </div>

              <div class="p-4 text-center bg-darker-surface/20">
                <button
                  class="text-accent-blue hover:text-accent-blue/80 text-sm font-medium"
                >
                  View Full Leaderboard
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <footer class="bg-darker-blue/50 border-t border-accent-blue/20 mt-16">
          <div class="max-w-7xl mx-auto px-6 py-12">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div class="col-span-1 md:col-span-2">
                <div class="flex items-center space-x-3 mb-4">
                  <div
                    class="w-10 h-10 bg-gradient-to-br from-accent-blue to-cyber-purple rounded-xl flex items-center justify-center"
                  >
                    <i class="fas fa-gamepad text-white text-lg"></i>
                  </div>
                  <div
                    class="text-xl font-bold bg-gradient-to-r from-accent-blue to-cyber-green bg-clip-text text-transparent"
                  >
                    Elite Gamer
                  </div>
                </div>
                <p class="text-gray-400 mb-6 max-w-md">
                  The ultimate destination for competitive gaming. Join
                  tournaments, climb leaderboards, and compete with the best
                  players worldwide.
                </p>
                <div class="flex space-x-4">
                  <a
                    href="#"
                    class="w-10 h-10 bg-accent-blue/20 hover:bg-accent-blue/40 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <i class="fab fa-discord text-accent-blue"></i>
                  </a>
                  <a
                    href="#"
                    class="w-10 h-10 bg-accent-blue/20 hover:bg-accent-blue/40 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <i class="fab fa-twitter text-accent-blue"></i>
                  </a>
                  <a
                    href="#"
                    class="w-10 h-10 bg-accent-blue/20 hover:bg-accent-blue/40 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <i class="fab fa-youtube text-accent-blue"></i>
                  </a>
                  <a
                    href="#"
                    class="w-10 h-10 bg-accent-blue/20 hover:bg-accent-blue/40 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <i class="fab fa-twitch text-accent-blue"></i>
                  </a>
                </div>
              </div>

              <div>
                <h3 class="font-semibold mb-4">Platform</h3>
                <div class="space-y-2">
                  <a
                    href="#"
                    class="block text-gray-400 hover:text-white transition-colors"
                    >Tournaments</a
                  >
                  <a
                    href="#"
                    class="block text-gray-400 hover:text-white transition-colors"
                    >Leaderboards</a
                  >
                  <a
                    href="#"
                    class="block text-gray-400 hover:text-white transition-colors"
                    >Live Streams</a
                  >
                  <a
                    href="#"
                    class="block text-gray-400 hover:text-white transition-colors"
                    >News & Updates</a
                  >
                </div>
              </div>

              <div>
                <h3 class="font-semibold mb-4">Support</h3>
                <div class="space-y-2">
                  <a
                    href="#"
                    class="block text-gray-400 hover:text-white transition-colors"
                    >Help Center</a
                  >
                  <a
                    href="#"
                    class="block text-gray-400 hover:text-white transition-colors"
                    >Contact Us</a
                  >
                  <a
                    href="#"
                    class="block text-gray-400 hover:text-white transition-colors"
                    >Bug Reports</a
                  >
                  <a
                    href="#"
                    class="block text-gray-400 hover:text-white transition-colors"
                    >Community</a
                  >
                </div>
              </div>
            </div>

            <div
              class="border-t border-accent-blue/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
            >
              <p class="text-gray-400 text-sm">
                &copy; 2024 Elite Gamer. All rights reserved.
              </p>
              <div class="flex space-x-6 mt-4 md:mt-0">
                <a
                  href="#"
                  class="text-gray-400 hover:text-white text-sm transition-colors"
                  >Privacy Policy</a
                >
                <a
                  href="#"
                  class="text-gray-400 hover:text-white text-sm transition-colors"
                  >Terms of Service</a
                >
                <a
                  href="#"
                  class="text-gray-400 hover:text-white text-sm transition-colors"
                  >Cookie Policy</a
                >
              </div>
            </div>
          </div>
        </footer>
      </main>
    </body>
  </ClientOnly>
</template>

<style scoped>
body {
  background: linear-gradient(180deg, #061322 0%, #071022 30%, #0d1624 100%);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-weight: 400;
}
</style>
