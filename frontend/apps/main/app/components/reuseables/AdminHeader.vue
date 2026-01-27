<template>
  <div
    class="min-h-screen bg-gradient-to-br from-darker-blue to-darker-surface"
  >
    <!-- Header -->
    <header
      class="fixed top-0 left-0 right-0 w-full bg-darker-blue/95 backdrop-blur-md border-b border-accent-blue/20 z-40"
    >
      <div class="flex items-center justify-between px-6 py-3">
        <!-- Logo Section -->
        <div class="flex items-center space-x-3">
          <div
            class="w-10 h-10 bg-gradient-to-br from-accent-blue to-cyber-purple rounded-xl flex items-center justify-center shadow-lg"
          >
            <i class="fas fa-gamepad text-white text-lg"></i>
          </div>
          <div class="hidden sm:block">
            <div
              class="text-xl font-bold bg-gradient-to-r from-accent-blue to-cyber-green bg-clip-text text-transparent"
            >
              Elite Gamer
            </div>
            <div class="text-xs text-gray-400">Tournament Platform</div>
          </div>
        </div>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:flex items-center space-x-6">
          <NuxtLink to="/" class="flex items-center space-x-2 text-cyber-green">
            <i class="fas fa-chart-line text-sm"></i>
            <span>Overview</span>
          </NuxtLink>
          <NuxtLink
            to="/ladder"
            class="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
          >
            <i class="fas fa-trophy text-sm"></i>
            <span>Ladder</span>
          </NuxtLink>
          <NuxtLink
            to="/archive"
            class="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
          >
            <i class="fas fa-archive text-sm"></i>
            <span>Archive</span>
          </NuxtLink>
        </nav>

        <!-- Desktop Filters and Search -->
        <div class="hidden lg:flex items-center space-x-4">
          <select
            v-model="selectedPlatform"
            class="bg-darker-surface border border-accent-blue/20 rounded-lg px-3 py-2 text-white text-sm focus:border-accent-blue/40 focus:outline-none"
          >
            <option value="">All Platforms</option>
            <option value="pc">PC</option>
            <option value="console">Console</option>
          </select>
          <select
            v-model="selectedRegion"
            class="bg-darker-surface border border-accent-blue/20 rounded-lg px-3 py-2 text-white text-sm focus:border-accent-blue/40 focus:outline-none"
          >
            <option value="eu">Region: Europe</option>
            <option value="na">Region: North America</option>
            <option value="asia">Region: Asia</option>
          </select>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search tournaments..."
            class="bg-darker-surface border border-accent-blue/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 w-64 focus:border-accent-blue/40 focus:outline-none"
          />
        </div>

        <!-- Right side icons and profile -->
        <div class="flex items-center space-x-2">
          <button
            @click="showNotifications = !showNotifications"
            class="p-2 hover:bg-accent-blue/20 rounded-lg transition-colors hidden md:block relative"
          >
            <i class="fas fa-bell text-gray-300 hover:text-white"></i>
            <span
              v-if="notificationCount > 0"
              class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
            >
              {{ notificationCount }}
            </span>
          </button>
          <button
            @click="toggleFavorites"
            class="p-2 hover:bg-accent-blue/20 rounded-lg transition-colors hidden md:block"
          >
            <i class="fas fa-star text-gray-300 hover:text-white"></i>
          </button>
          <div class="flex items-center space-x-2">
            <div
              class="w-8 h-8 bg-gradient-to-br from-cyber-purple to-pink-600 rounded-full flex items-center justify-center"
            >
              <i class="fas fa-user text-white text-sm"></i>
            </div>
            <span class="hidden xl:inline text-sm text-white">{{
              user.name
            }}</span>
          </div>

          <!-- Mobile Menu Button -->
          <button
            @click="toggleDrawer"
            class="p-2 hover:bg-accent-blue/20 rounded-lg transition-colors lg:hidden ml-2"
          >
            <i class="fas fa-bars text-gray-300 hover:text-white"></i>
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="flex flex-col h-screen pt-20">
      <!-- Free Size Component (Fixed) -->
      <div
        class="bg-darker-surface/50 border-b border-accent-blue/10 p-6 py-1 flex-shrink-0"
      >
        <div class="max-w-7xl mx-auto">
          <h1 class="text-2xl font-bold text-white mb-2">
            Tournament Dashboard
          </h1>
          <p class="text-gray-400">Welcome back to your gaming hub</p>
        </div>
      </div>

      <!-- Main Content Area (Scrollable) -->
      <div class="flex-1 overflow-y-auto p-6 scrollable-content">
        <div class="max-w-7xl mx-auto">
          <!-- <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="bg-darker-surface/80 rounded-xl border border-accent-blue/20 p-6 hover:border-accent-blue/40 transition-colors">
              <div class="flex items-center space-x-3 mb-4">
                <i class="fas fa-trophy text-cyber-green text-xl"></i>
                <h3 class="text-lg font-semibold text-white">Active Tournaments</h3>
              </div>
              <p class="text-3xl font-bold text-cyber-green mb-2">{{ stats.activeTournaments }}</p>
              <p class="text-gray-400 text-sm">Currently running</p>
            </div>

            <div class="bg-darker-surface/80 rounded-xl border border-accent-blue/20 p-6 hover:border-accent-blue/40 transition-colors">
              <div class="flex items-center space-x-3 mb-4">
                <i class="fas fa-users text-accent-blue text-xl"></i>
                <h3 class="text-lg font-semibold text-white">Players Online</h3>
              </div>
              <p class="text-3xl font-bold text-accent-blue mb-2">{{ stats.playersOnline.toLocaleString() }}</p>
              <p class="text-gray-400 text-sm">Active now</p>
            </div>

            <div class="bg-darker-surface/80 rounded-xl border border-accent-blue/20 p-6 hover:border-accent-blue/40 transition-colors">
              <div class="flex items-center space-x-3 mb-4">
                <i class="fas fa-medal text-cyber-purple text-xl"></i>
                <h3 class="text-lg font-semibold text-white">Your Rank</h3>
              </div>
              <p class="text-3xl font-bold text-cyber-purple mb-2">#{{ user.rank }}</p>
              <p class="text-gray-400 text-sm">Global ranking</p>
            </div>
          </div> -->
          <slot />
        </div>
      </div>
    </div>

    <!-- Mobile Drawer Overlay -->
    <Transition name="overlay">
      <div
        v-if="showDrawer"
        @click="closeDrawer"
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 lg:hidden"
      ></div>
    </Transition>

    <!-- Mobile Drawer -->
    <Transition name="drawer">
      <div
        v-if="showDrawer"
        class="fixed top-0 right-0 h-full w-80 bg-darker-surface border-l border-accent-blue/20 z-50 lg:hidden overflow-y-auto pt-20 drawer-scrollable"
      >
        <div class="p-6">
          <!-- Drawer Header -->
          <div class="flex items-center justify-between mb-8">
            <div class="flex items-center space-x-3">
              <div
                class="w-10 h-10 bg-gradient-to-br from-cyber-purple to-pink-600 rounded-full flex items-center justify-center"
              >
                <i class="fas fa-user text-white text-sm"></i>
              </div>
              <div>
                <div class="text-white font-semibold">{{ user.name }}</div>
                <div class="text-gray-400 text-sm">{{ user.title }}</div>
              </div>
            </div>
            <button
              @click="closeDrawer"
              class="p-2 hover:bg-accent-blue/20 rounded-lg transition-colors"
            >
              <i class="fas fa-times text-gray-300 hover:text-white"></i>
            </button>
          </div>

          <!-- Mobile Navigation -->
          <nav class="space-y-4 mb-8">
            <NuxtLink
              to="/"
              @click="closeDrawer"
              class="flex items-center space-x-3 p-3 rounded-lg"
              :class="
                $route.path === '/'
                  ? 'bg-cyber-green/20 text-cyber-green'
                  : 'text-gray-300 hover:bg-accent-blue/20 hover:text-white'
              "
            >
              <i class="fas fa-chart-line"></i>
              <span>Overview</span>
            </NuxtLink>
            <NuxtLink
              to="/ladder"
              @click="closeDrawer"
              class="flex items-center space-x-3 p-3 rounded-lg transition-colors"
              :class="
                $route.path === '/ladder'
                  ? 'bg-cyber-green/20 text-cyber-green'
                  : 'text-gray-300 hover:bg-accent-blue/20 hover:text-white'
              "
            >
              <i class="fas fa-trophy"></i>
              <span>Ladder</span>
            </NuxtLink>
            <NuxtLink
              to="/archive"
              @click="closeDrawer"
              class="flex items-center space-x-3 p-3 rounded-lg transition-colors"
              :class="
                $route.path === '/archive'
                  ? 'bg-cyber-green/20 text-cyber-green'
                  : 'text-gray-300 hover:bg-accent-blue/20 hover:text-white'
              "
            >
              <i class="fas fa-archive"></i>
              <span>Archive</span>
            </NuxtLink>
            <button
              @click="showNotifications = !showNotifications"
              class="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-accent-blue/20 hover:text-white transition-colors w-full text-left"
            >
              <i class="fas fa-bell"></i>
              <span>Notifications</span>
              <span
                v-if="notificationCount > 0"
                class="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-1"
              >
                {{ notificationCount }}
              </span>
            </button>
            <button
              @click="toggleFavorites"
              class="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-accent-blue/20 hover:text-white transition-colors w-full text-left"
            >
              <i class="fas fa-star"></i>
              <span>Favorites</span>
            </button>
          </nav>

          <!-- Mobile Filters -->
          <div class="space-y-4">
            <div>
              <label class="block text-gray-300 text-sm mb-2">Platform</label>
              <select
                v-model="selectedPlatform"
                class="w-full bg-darker-blue border border-accent-blue/20 rounded-lg px-3 py-2 text-white text-sm focus:border-accent-blue/40 focus:outline-none"
              >
                <option value="">All Platforms</option>
                <option value="pc">PC</option>
                <option value="console">Console</option>
              </select>
            </div>
            <div>
              <label class="block text-gray-300 text-sm mb-2">Region</label>
              <select
                v-model="selectedRegion"
                class="w-full bg-darker-blue border border-accent-blue/20 rounded-lg px-3 py-2 text-white text-sm focus:border-accent-blue/40 focus:outline-none"
              >
                <option value="eu">Europe</option>
                <option value="na">North America</option>
                <option value="asia">Asia</option>
              </select>
            </div>
            <div>
              <label class="block text-gray-300 text-sm mb-2">Search</label>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search tournaments..."
                class="w-full bg-darker-blue border border-accent-blue/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-accent-blue/40 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
// Meta and head management
useHead({
  title: "Elite Gamer - Tournament Platform",
  meta: [
    {
      name: "description",
      content: "Elite gaming tournament platform for competitive players",
    },
  ],
  link: [
    {
      rel: "stylesheet",
      href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css",
    },
  ],
});

// Reactive data
const showDrawer = ref(false);
const showNotifications = ref(false);
const selectedPlatform = ref("");
const selectedRegion = ref("eu");
const searchQuery = ref("");

// User data (could be from Pinia store or composable)
const user = ref({
  name: "Elite Gamer",
  title: "Pro Player",
  rank: 247,
});

// Stats data (could come from API)
const stats = ref({
  activeTournaments: 12,
  playersOnline: 1847,
});

const notificationCount = ref(3);

// Recent activity data
const recentActivity = ref([
  {
    id: 1,
    title: 'Victory in "Cyber Championship"',
    time: "2 hours ago",
    icon: "fas fa-trophy",
    iconBg: "bg-gradient-to-br from-cyber-green to-accent-blue",
  },
  {
    id: 2,
    title: "Achieved new personal best",
    time: "5 hours ago",
    icon: "fas fa-star",
    iconBg: "bg-gradient-to-br from-cyber-purple to-pink-600",
  },
  {
    id: 3,
    title: 'Joined "Elite Warriors" team',
    time: "1 day ago",
    icon: "fas fa-users",
    iconBg: "bg-gradient-to-br from-accent-blue to-cyber-purple",
  },
]);

// Methods
const toggleDrawer = () => {
  showDrawer.value = !showDrawer.value;
};

const closeDrawer = () => {
  showDrawer.value = false;
};

const toggleFavorites = () => {
  // Handle favorites toggle
  console.log("Favorites toggled");
};

// Close drawer on route change
const route = useRoute();
watch(
  () => route.path,
  () => {
    showDrawer.value = false;
  }
);

// Close drawer on window resize
onMounted(() => {
  const handleResize = () => {
    if (window.innerWidth >= 1024) {
      showDrawer.value = false;
    }
  };

  window.addEventListener("resize", handleResize);

  onUnmounted(() => {
    window.removeEventListener("resize", handleResize);
  });
});
</script>

<style scoped>
/* Custom Scrollbar for Main Content */
.scrollable-content::-webkit-scrollbar {
  width: 8px;
}

.scrollable-content::-webkit-scrollbar-track {
  background: rgba(10, 15, 20, 0.8);
  border-radius: 4px;
}

.scrollable-content::-webkit-scrollbar-thumb {
  background: linear-gradient(
    180deg,
    rgba(0, 212, 255, 0.6) 0%,
    rgba(139, 92, 246, 0.6) 100%
  );
  border-radius: 4px;
  transition: all 0.2s ease;
}

.scrollable-content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(
    180deg,
    rgba(0, 212, 255, 0.8) 0%,
    rgba(139, 92, 246, 0.8) 100%
  );
  box-shadow: 0 0 8px rgba(0, 212, 255, 0.2);
}

.scrollable-content::-webkit-scrollbar-corner {
  background: transparent;
  display: none;
}

.scrollable-content::-webkit-scrollbar-button {
  display: none;
}

/* Firefox scrollbar */
.scrollable-content {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 212, 255, 0.6) rgba(10, 15, 20, 0.8);
}

/* Custom Scrollbar for Mobile Drawer */
.drawer-scrollable::-webkit-scrollbar {
  width: 6px;
  height: 5px;
}

.drawer-scrollable::-webkit-scrollbar-track {
  background: rgba(10, 15, 20, 0.8);
  border-radius: 3px;
}

.drawer-scrollable::-webkit-scrollbar-thumb {
  background: linear-gradient(
    180deg,
    rgba(0, 212, 255, 0.6) 0%,
    rgba(139, 92, 246, 0.6) 100%
  );
  border-radius: 3px;
  transition: all 0.2s ease;
}

.drawer-scrollable::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(
    180deg,
    rgba(0, 212, 255, 0.8) 0%,
    rgba(139, 92, 246, 0.8) 100%
  );
  box-shadow: 0 0 6px rgba(0, 212, 255, 0.2);
}

.drawer-scrollable::-webkit-scrollbar-corner {
  background: transparent;
  display: none;
}

.drawer-scrollable::-webkit-scrollbar-button {
  display: none;
}

.drawer-scrollable {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 212, 255, 0.6) rgba(10, 15, 20, 0.8);
}

/* Drawer animations */
.drawer-enter-active,
.drawer-leave-active {
  transition: transform 0.3s ease-in-out;
}

.drawer-enter-from {
  transform: translateX(100%);
}

.drawer-leave-to {
  transform: translateX(100%);
}

/* Overlay animations */
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease-in-out;
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}
/* ::-webkit-scrollbar {
  width: 8px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1 !important;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background-color: #00d4ff !important;
  border-radius: 40px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #0099cc !important;
}
</style>
