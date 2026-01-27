<script setup lang="ts">
import { Icon } from "@iconify/vue";
import { ref } from "vue";

definePageMeta({
  title: "Elite Gamer - Tournament Detail",
  layout: false,
});

useHead({
  title: "Elite Gamer - Tournament Detail",
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

const selectedTab = ref("overview");
const showJoinDialog = ref(false);
const currentStep = ref(1);
const acceptedTerms = ref(false);
const acceptedRisk = ref(false);

// Form data
const registrationForm = ref({
  teamName: "",
  playerName: "",
  email: "",
  phone: "",
  discordId: "",
});

const nextStep = () => {
  if (currentStep.value < 3) {
    currentStep.value++;
  }
};

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
};

const closeDialog = () => {
  showJoinDialog.value = false;
  currentStep.value = 1;
  acceptedTerms.value = false;
  acceptedRisk.value = false;
  registrationForm.value = {
    teamName: "",
    playerName: "",
    email: "",
    phone: "",
    discordId: "",
  };
};

const tournamentInfo = {
  name: "Winter 2025 Championship",
  game: "League of Legends",
  status: "Registration Open",
  startDate: "Dec 15, 2024",
  startTime: "18:00 UTC",
  endDate: "Dec 22, 2024",
  prizePool: "25,000 pts",
  currentPlayers: 23,
  maxPlayers: 40,
  format: "Single Elimination",
  platform: "PC",
  region: "Europe",
  organizer: "Elite Gamer Arena",
};

const schedule = [
  { phase: "Registration", date: "Dec 1 - Dec 14", status: "active" },
  { phase: "Group Stage", date: "Dec 15 - Dec 17", status: "upcoming" },
  { phase: "Quarter Finals", date: "Dec 18", status: "upcoming" },
  { phase: "Semi Finals", date: "Dec 20", status: "upcoming" },
  { phase: "Grand Finals", date: "Dec 22", status: "upcoming" },
];

const rules = [
  "All participants must be registered before the deadline",
  "Match fixing and cheating will result in immediate disqualification",
  "Players must join the match lobby 10 minutes before start time",
  "No substitutions allowed after registration closes",
  "Tournament organizers have final say in all disputes",
  "Participants must follow the official game rules",
];

const prizes = [
  { place: "1st Place", reward: "10,000 pts", icon: "trophy", color: "from-yellow-400 to-yellow-600" },
  { place: "2nd Place", reward: "6,000 pts", icon: "medal", color: "from-gray-300 to-gray-400" },
  { place: "3rd Place", reward: "4,000 pts", icon: "award", color: "from-orange-400 to-orange-600" },
  { place: "4th Place", reward: "2,500 pts", icon: "star", color: "from-blue-400 to-blue-600" },
];

const registeredPlayers = [
  { name: "ProGamer_X", avatar: "from-purple-500 to-pink-600", joinedDate: "Dec 1, 2024", rank: "#24" },
  { name: "SkillMaster", avatar: "from-blue-500 to-cyan-600", joinedDate: "Dec 2, 2024", rank: "#45" },
  { name: "Champion_2024", avatar: "from-green-500 to-emerald-600", joinedDate: "Dec 3, 2024", rank: "#89" },
  { name: "NightHawk", avatar: "from-red-500 to-orange-500", joinedDate: "Dec 3, 2024", rank: "#156" },
  { name: "ShadowStrike", avatar: "from-violet-500 to-purple-600", joinedDate: "Dec 4, 2024", rank: "#203" },
  { name: "ThunderBolt", avatar: "from-yellow-500 to-amber-600", joinedDate: "Dec 5, 2024", rank: "#312" },
];
</script>

<template>
  <ClientOnly>
    <body class="bg-dark-bg min-h-screen text-white">
      <!-- Fixed Header -->
      <header
        class="fixed top-0 w-full bg-darker-blue/95 backdrop-blur-md border-b border-accent-blue/20 z-40"
      >
        <div class="max-w-7xl mx-auto px-6 py-4">
          <div class="flex items-center justify-between">
            <!-- Left side -->
            <div class="flex items-center space-x-6">
              <a href="#" class="flex items-center space-x-3">
                <div
                  class="w-10 h-10 bg-gradient-to-br from-accent-blue to-cyber-purple rounded-xl flex items-center justify-center shadow-lg"
                >
                  <i class="fas fa-gamepad text-white text-lg"></i>
                </div>
                <div
                  class="text-xl font-bold bg-gradient-to-r from-accent-blue to-cyber-green bg-clip-text text-transparent"
                >
                  Elite Gamer
                </div>
              </a>

              <nav class="hidden md:flex items-center space-x-6 ml-8">
                <a
                  href="#"
                  class="text-gray-300 hover:text-white transition-colors"
                  >Tournaments</a
                >
                <a
                  href="#"
                  class="text-gray-300 hover:text-white transition-colors"
                  >Streams</a
                >
                <a
                  href="#"
                  class="text-gray-300 hover:text-white transition-colors"
                  >Leaderboards</a
                >
              </nav>
            </div>

            <!-- Right Side -->
            <div class="flex items-center space-x-4">
              <button
                class="p-2 hover:bg-accent-blue/20 rounded-lg transition-colors"
              >
                <i class="fas fa-bell text-gray-300 hover:text-white"></i>
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

      <!-- Main Content -->
      <main class="pt-24 pb-16">
        <div class="max-w-7xl mx-auto px-6">
          <!-- Tournament Hero -->
          <div
            class="bg-hero-gradient rounded-2xl overflow-hidden border border-accent-blue/20 shadow-2xl mb-8 relative"
          >
            <!-- Background Decorations -->
            <div
              class="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30"
            ></div>
            <div
              class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-purple-600/20 to-transparent rounded-full blur-3xl"
            ></div>
            <div
              class="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-accent-blue/20 to-transparent rounded-full blur-3xl"
            ></div>

            <div class="relative z-10 p-8">
              <!-- Breadcrumb -->
              <div class="flex items-center space-x-2 text-sm text-gray-400 mb-6">
                <a href="#" class="hover:text-white transition-colors"
                  >Tournaments</a
                >
                <i class="fas fa-chevron-right text-xs"></i>
                <a href="#" class="hover:text-white transition-colors"
                  >League of Legends</a
                >
                <i class="fas fa-chevron-right text-xs"></i>
                <span class="text-white">Winter 2025 Championship</span>
              </div>

              <div class="flex flex-col lg:flex-row items-start justify-between">
                <div class="flex-1 mb-6 lg:mb-0">
                  <!-- Tournament Image/Icon -->
                  <div
                    class="w-24 h-24 bg-gradient-to-br from-purple-600 via-blue-600 to-purple-800 rounded-2xl flex items-center justify-center mb-6 border-2 border-white/20 shadow-2xl"
                  >
                    <i class="fas fa-sword text-5xl text-white drop-shadow-lg"></i>
                  </div>

                  <!-- Tournament Name -->
                  <h1
                    class="text-4xl lg:text-5xl font-bold mb-4 leading-tight"
                    style="font-family: Orbitron, sans-serif"
                  >
                    {{ tournamentInfo.name }}
                  </h1>

                  <!-- Tournament Meta -->
                  <div class="flex flex-wrap gap-3 mb-6">
                    <span
                      class="bg-purple-600/80 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-semibold border border-purple-400/30"
                    >
                      {{ tournamentInfo.game }}
                    </span>
                    <span
                      class="bg-cyber-green/20 text-cyber-green backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-semibold border border-cyber-green/30 animate-pulse"
                    >
                      <i class="fas fa-circle text-xs mr-2"></i>{{
                        tournamentInfo.status
                      }}
                    </span>
                    <span
                      class="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-sm border border-white/20"
                    >
                      <i class="fab fa-windows mr-2"></i>{{ tournamentInfo.platform }}
                    </span>
                    <span
                      class="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-sm border border-white/20"
                    >
                      <i class="fas fa-globe mr-2"></i>{{ tournamentInfo.region }}
                    </span>
                  </div>

                  <!-- Quick Stats -->
                  <div class="flex items-center space-x-8">
                    <div>
                      <div class="text-sm text-gray-400 mb-1">Prize Pool</div>
                      <div
                        class="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent"
                      >
                        {{ tournamentInfo.prizePool }}
                      </div>
                    </div>
                    <div>
                      <div class="text-sm text-gray-400 mb-1">Players</div>
                      <div class="text-2xl font-bold text-white">
                        {{ tournamentInfo.currentPlayers }}/{{
                          tournamentInfo.maxPlayers
                        }}
                      </div>
                    </div>
                    <div>
                      <div class="text-sm text-gray-400 mb-1">Format</div>
                      <div class="text-2xl font-bold text-accent-blue">
                        {{ tournamentInfo.format }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Action Card -->
                <div
                  class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 min-w-[320px] shadow-2xl"
                >
                  <div class="text-center mb-6">
                    <div class="text-sm text-gray-400 mb-2">Tournament Starts In</div>
                    <div class="text-4xl font-bold text-cyber-green mb-1">
                      07:45:52
                    </div>
                    <div class="text-sm text-gray-400">
                      {{ tournamentInfo.startDate }} at {{ tournamentInfo.startTime }}
                    </div>
                  </div>

                  <button
                    @click="showJoinDialog = true"
                    class="w-full bg-gradient-to-r from-cyber-green to-accent-blue hover:from-cyber-green/80 hover:to-accent-blue/80 px-6 py-4 rounded-xl font-bold text-lg text-black transition-all duration-200 shadow-lg mb-4"
                  >
                    <i class="fas fa-trophy mr-2"></i>Join Tournament
                  </button>

                  <div class="flex gap-2">
                    <button
                      class="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                    >
                      <i class="fas fa-share mr-2"></i>Share
                    </button>
                    <button
                      class="flex-1 bg-white/10 hover:bg-white/20 border border-white/20 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                    >
                      <i class="fas fa-star mr-2"></i>Follow
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Tabs Navigation using Radix UI -->
          <TabsRoot v-model="selectedTab" class="mb-8">
            <TabsList
              class="bg-darker-surface border border-accent-blue/20 rounded-xl p-1 inline-flex space-x-1"
            >
              <TabsTrigger
                value="overview"
                class="px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 data-[state=active]:bg-accent-blue data-[state=active]:text-white text-gray-400 hover:text-white"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="schedule"
                class="px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 data-[state=active]:bg-accent-blue data-[state=active]:text-white text-gray-400 hover:text-white"
              >
                Schedule
              </TabsTrigger>
              <TabsTrigger
                value="participants"
                class="px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 data-[state=active]:bg-accent-blue data-[state=active]:text-white text-gray-400 hover:text-white"
              >
                Participants
              </TabsTrigger>
              <TabsTrigger
                value="rules"
                class="px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 data-[state=active]:bg-accent-blue data-[state=active]:text-white text-gray-400 hover:text-white"
              >
                Rules
              </TabsTrigger>
              <TabsTrigger
                value="prizes"
                class="px-6 py-3 rounded-lg text-sm font-medium transition-all duration-200 data-[state=active]:bg-accent-blue data-[state=active]:text-white text-gray-400 hover:text-white"
              >
                Prizes
              </TabsTrigger>
            </TabsList>

            <!-- Overview Tab -->
            <TabsContent value="overview" class="mt-6">
              <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <!-- Tournament Info -->
                <div class="lg:col-span-2">
                  <div
                    class="bg-card-gradient border border-accent-blue/20 rounded-2xl p-6 mb-6"
                  >
                    <h2 class="text-2xl font-bold mb-4">About Tournament</h2>
                    <p class="text-gray-300 mb-4 leading-relaxed">
                      Welcome to the Winter 2025 Championship! This is the biggest
                      League of Legends tournament of the season, featuring the
                      best players from across Europe. Compete for glory, climb
                      the ranks, and win amazing prizes.
                    </p>
                    <p class="text-gray-300 mb-4 leading-relaxed">
                      This tournament will test your skills, strategy, and
                      teamwork. Only the best will advance through each stage to
                      reach the grand finals. Make sure you're prepared and ready
                      to give your best performance!
                    </p>
                    <div
                      class="bg-accent-blue/10 border border-accent-blue/20 rounded-lg p-4"
                    >
                      <div class="flex items-start space-x-3">
                        <i class="fas fa-info-circle text-accent-blue mt-1"></i>
                        <div>
                          <div class="font-semibold mb-1">Important Notice</div>
                          <div class="text-sm text-gray-400">
                            All participants must be registered at least 24 hours
                            before the tournament starts. Late registrations will
                            not be accepted.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Tournament Stats -->
                  <div
                    class="bg-card-gradient border border-accent-blue/20 rounded-2xl p-6"
                  >
                    <h2 class="text-2xl font-bold mb-6">Tournament Stats</h2>
                    <div class="grid grid-cols-2 gap-6">
                      <div
                        class="bg-darker-surface/50 rounded-xl p-4 border border-accent-blue/10"
                      >
                        <div class="text-sm text-gray-400 mb-2">Total Matches</div>
                        <div class="text-3xl font-bold text-white">39</div>
                      </div>
                      <div
                        class="bg-darker-surface/50 rounded-xl p-4 border border-accent-blue/10"
                      >
                        <div class="text-sm text-gray-400 mb-2">Avg. Duration</div>
                        <div class="text-3xl font-bold text-white">35 min</div>
                      </div>
                      <div
                        class="bg-darker-surface/50 rounded-xl p-4 border border-accent-blue/10"
                      >
                        <div class="text-sm text-gray-400 mb-2">Slots Filled</div>
                        <div class="text-3xl font-bold text-cyber-green">58%</div>
                      </div>
                      <div
                        class="bg-darker-surface/50 rounded-xl p-4 border border-accent-blue/10"
                      >
                        <div class="text-sm text-gray-400 mb-2">
                          Spectators Expected
                        </div>
                        <div class="text-3xl font-bold text-accent-blue">5.2K</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Sidebar -->
                <div class="space-y-6">
                  <!-- Tournament Details -->
                  <div
                    class="bg-card-gradient border border-accent-blue/20 rounded-2xl p-6"
                  >
                    <h3 class="text-xl font-bold mb-4">Details</h3>
                    <div class="space-y-4">
                      <div class="flex justify-between items-center">
                        <span class="text-gray-400 text-sm">Organizer</span>
                        <span class="font-medium">{{
                          tournamentInfo.organizer
                        }}</span>
                      </div>
                      <div class="flex justify-between items-center">
                        <span class="text-gray-400 text-sm">Start Date</span>
                        <span class="font-medium">{{
                          tournamentInfo.startDate
                        }}</span>
                      </div>
                      <div class="flex justify-between items-center">
                        <span class="text-gray-400 text-sm">End Date</span>
                        <span class="font-medium">{{
                          tournamentInfo.endDate
                        }}</span>
                      </div>
                      <div class="flex justify-between items-center">
                        <span class="text-gray-400 text-sm">Format</span>
                        <span class="font-medium">{{
                          tournamentInfo.format
                        }}</span>
                      </div>
                      <div class="flex justify-between items-center">
                        <span class="text-gray-400 text-sm">Region</span>
                        <span class="font-medium">{{ tournamentInfo.region }}</span>
                      </div>
                    </div>
                  </div>

                  <!-- Progress Bar -->
                  <div
                    class="bg-card-gradient border border-accent-blue/20 rounded-2xl p-6"
                  >
                    <h3 class="text-xl font-bold mb-4">Registration Progress</h3>
                    <div class="mb-4">
                      <div class="flex justify-between text-sm mb-2">
                        <span class="text-gray-400">Players Registered</span>
                        <span class="font-medium"
                          >{{ tournamentInfo.currentPlayers }}/{{
                            tournamentInfo.maxPlayers
                          }}</span
                        >
                      </div>
                      <div
                        class="h-3 bg-darker-surface rounded-full overflow-hidden"
                      >
                        <div
                          class="h-full bg-gradient-to-r from-cyber-green to-accent-blue rounded-full transition-all duration-500"
                          :style="`width: ${(tournamentInfo.currentPlayers / tournamentInfo.maxPlayers) * 100}%`"
                        ></div>
                      </div>
                    </div>
                    <div class="text-sm text-gray-400">
                      {{
                        tournamentInfo.maxPlayers - tournamentInfo.currentPlayers
                      }}
                      slots remaining
                    </div>
                  </div>

                  <!-- Social Share -->
                  <div
                    class="bg-gradient-to-br from-cyber-purple/20 to-accent-blue/20 border border-accent-blue/30 rounded-2xl p-6"
                  >
                    <h3 class="text-xl font-bold mb-4">Share Tournament</h3>
                    <div class="flex gap-2">
                      <button
                        class="flex-1 bg-[#5865F2] hover:bg-[#4752C4] py-3 rounded-lg transition-colors"
                      >
                        <i class="fab fa-discord"></i>
                      </button>
                      <button
                        class="flex-1 bg-[#1DA1F2] hover:bg-[#1A8CD8] py-3 rounded-lg transition-colors"
                      >
                        <i class="fab fa-twitter"></i>
                      </button>
                      <button
                        class="flex-1 bg-[#6441A5] hover:bg-[#553A8F] py-3 rounded-lg transition-colors"
                      >
                        <i class="fab fa-twitch"></i>
                      </button>
                      <button
                        class="flex-1 bg-white/10 hover:bg-white/20 py-3 rounded-lg transition-colors border border-white/20"
                      >
                        <i class="fas fa-link"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <!-- Schedule Tab -->
            <TabsContent value="schedule" class="mt-6">
              <div
                class="bg-card-gradient border border-accent-blue/20 rounded-2xl p-6"
              >
                <h2 class="text-2xl font-bold mb-6">Tournament Schedule</h2>
                <div class="space-y-4">
                  <div
                    v-for="(phase, index) in schedule"
                    :key="index"
                    class="flex items-center space-x-4 p-4 rounded-xl transition-all duration-200"
                    :class="
                      phase.status === 'active'
                        ? 'bg-accent-blue/10 border border-accent-blue/30'
                        : 'bg-darker-surface/50 border border-accent-blue/10 hover:border-accent-blue/20'
                    "
                  >
                    <div
                      class="w-12 h-12 rounded-full flex items-center justify-center font-bold"
                      :class="
                        phase.status === 'active'
                          ? 'bg-gradient-to-br from-cyber-green to-accent-blue text-black'
                          : 'bg-darker-surface text-gray-400'
                      "
                    >
                      {{ index + 1 }}
                    </div>
                    <div class="flex-1">
                      <div class="font-semibold text-lg">{{ phase.phase }}</div>
                      <div class="text-sm text-gray-400">{{ phase.date }}</div>
                    </div>
                    <div
                      v-if="phase.status === 'active'"
                      class="bg-cyber-green/20 text-cyber-green px-4 py-2 rounded-lg text-sm font-semibold border border-cyber-green/30"
                    >
                      <i class="fas fa-circle text-xs mr-2 animate-pulse"></i
                      >Active
                    </div>
                    <div
                      v-else
                      class="bg-gray-600/20 text-gray-400 px-4 py-2 rounded-lg text-sm font-semibold border border-gray-600/30"
                    >
                      Upcoming
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <!-- Participants Tab -->
            <TabsContent value="participants" class="mt-6">
              <div
                class="bg-card-gradient border border-accent-blue/20 rounded-2xl p-6"
              >
                <div class="flex items-center justify-between mb-6">
                  <h2 class="text-2xl font-bold">Registered Players</h2>
                  <div
                    class="bg-accent-blue/20 text-accent-blue px-4 py-2 rounded-lg text-sm font-semibold"
                  >
                    {{ tournamentInfo.currentPlayers }} Players
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div
                    v-for="(player, index) in registeredPlayers"
                    :key="index"
                    class="bg-darker-surface/50 rounded-xl p-4 border border-accent-blue/10 hover:border-accent-blue/30 transition-all duration-200"
                  >
                    <div class="flex items-center space-x-4">
                      <div
                        class="w-12 h-12 rounded-full bg-gradient-to-br shadow-lg"
                        :class="player.avatar"
                      ></div>
                      <div class="flex-1">
                        <div class="font-semibold">{{ player.name }}</div>
                        <div class="text-sm text-gray-400">
                          Joined {{ player.joinedDate }}
                        </div>
                      </div>
                      <div
                        class="bg-accent-blue/20 text-accent-blue px-3 py-1 rounded-lg text-sm font-semibold"
                      >
                        {{ player.rank }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="text-center mt-6">
                  <button
                    class="text-accent-blue hover:text-accent-blue/80 text-sm font-medium"
                  >
                    Load More Players
                  </button>
                </div>
              </div>
            </TabsContent>

            <!-- Rules Tab -->
            <TabsContent value="rules" class="mt-6">
              <div
                class="bg-card-gradient border border-accent-blue/20 rounded-2xl p-6"
              >
                <h2 class="text-2xl font-bold mb-6">Tournament Rules</h2>
                <div class="space-y-4">
                  <div
                    v-for="(rule, index) in rules"
                    :key="index"
                    class="flex items-start space-x-4 p-4 bg-darker-surface/50 rounded-xl border border-accent-blue/10"
                  >
                    <div
                      class="w-8 h-8 bg-gradient-to-br from-accent-blue to-cyber-purple rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                    >
                      {{ index + 1 }}
                    </div>
                    <p class="text-gray-300 pt-1">{{ rule }}</p>
                  </div>
                </div>

                <div
                  class="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mt-6"
                >
                  <div class="flex items-start space-x-3">
                    <i class="fas fa-exclamation-triangle text-red-500 mt-1"></i>
                    <div>
                      <div class="font-semibold text-red-400 mb-1">
                        Important Warning 
                      </div>
                      <div class="text-sm text-gray-300">
                        Violation of any tournament rules may result in immediate
                        disqualification and potential ban from future tournaments.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <!-- Prizes Tab -->
            <TabsContent value="prizes" class="mt-6">
              <div
                class="bg-card-gradient border border-accent-blue/20 rounded-2xl p-6"
              >
                <h2 class="text-2xl font-bold mb-6">Prize Distribution</h2>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div
                    v-for="(prize, index) in prizes"
                    :key="index"
                    class="bg-darker-surface/50 rounded-2xl p-6 border border-accent-blue/10 hover:border-accent-blue/30 transition-all duration-200 hover:scale-105"
                  >
                    <div class="flex items-center space-x-4 mb-4">
                      <div
                        class="w-16 h-16 rounded-full bg-gradient-to-br flex items-center justify-center shadow-lg"
                        :class="prize.color"
                      >
                        <i :class="`fas fa-${prize.icon} text-2xl text-white`"></i>
                      </div>
                      <div>
                        <div class="text-2xl font-bold">{{ prize.place }}</div>
                        <div class="text-sm text-gray-400">Winner</div>
                      </div>
                    </div>
                    <div
                      class="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent"
                    >
                      {{ prize.reward }}
                    </div>
                  </div>
                </div>

                <div
                  class="bg-gradient-to-r from-cyber-purple/20 to-accent-blue/20 border border-accent-blue/30 rounded-xl p-6 mt-6"
                >
                  <h3 class="font-semibold mb-2">Additional Rewards</h3>
                  <p class="text-gray-300 text-sm mb-4">
                    All participants will receive participation badges and special
                    in-game items. Top 8 players will receive exclusive tournament
                    merchandise.
                  </p>
                  <div class="flex flex-wrap gap-2">
                    <span
                      class="bg-white/10 border border-white/20 px-3 py-1 rounded-lg text-sm"
                      ><i class="fas fa-medal mr-2"></i>Participation Badge</span
                    >
                    <span
                      class="bg-white/10 border border-white/20 px-3 py-1 rounded-lg text-sm"
                      ><i class="fas fa-gift mr-2"></i>In-Game Items</span
                    >
                    <span
                      class="bg-white/10 border border-white/20 px-3 py-1 rounded-lg text-sm"
                      ><i class="fas fa-tshirt mr-2"></i>Exclusive Merch</span
                    >
                  </div>
                </div>
              </div>
            </TabsContent>
          </TabsRoot>
        </div>
      </main>

      <!-- Join Tournament Dialog using Radix UI -->
      <DialogRoot v-model:open="showJoinDialog">
        <DialogPortal>
          <DialogOverlay
            class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          />
          <DialogContent
            class="fixed left-[50%] top-[50%] z-50 w-full max-w-3xl max-h-[85vh] translate-x-[-50%] translate-y-[-50%] bg-card-gradient border border-accent-blue/30 rounded-2xl shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 overflow-hidden flex flex-col"
          >
            <!-- Header - Compact -->
            <div class="px-6 py-3 border-b border-accent-blue/20">
              <DialogTitle class="text-xl font-bold text-white"
                >Đăng ký tham gia giải đấu</DialogTitle
              >
              <DialogDescription class="text-sm text-gray-400">
                {{ tournamentInfo.name }}
              </DialogDescription>
            </div>

            <!-- Step Indicator - Compact -->
            <div class="px-6 py-3 bg-darker-surface/30">
              <div class="flex items-center justify-between relative">
                <div
                  class="absolute top-4 left-0 right-0 h-0.5 bg-darker-surface"
                  style="z-index: 0"
                >
                  <div
                    class="h-full bg-gradient-to-r from-cyber-green to-accent-blue transition-all duration-500"
                    :style="`width: ${((currentStep - 1) / 2) * 100}%`"
                  ></div>
                </div>

                <div class="flex justify-between w-full relative z-10">
                  <div class="flex flex-col items-center">
                    <div
                      class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1 transition-all duration-300"
                      :class="
                        currentStep >= 1
                          ? 'bg-gradient-to-br from-cyber-green to-accent-blue text-black shadow-lg'
                          : 'bg-darker-surface text-gray-400'
                      "
                    >
                      <i v-if="currentStep > 1" class="fas fa-check text-xs"></i>
                      <span v-else>1</span>
                    </div>
                    <span
                      class="text-xs font-medium"
                      :class="currentStep >= 1 ? 'text-white' : 'text-gray-400'"
                      >Xác nhận</span
                    >
                  </div>

                  <div class="flex flex-col items-center">
                    <div
                      class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1 transition-all duration-300"
                      :class="
                        currentStep >= 2
                          ? 'bg-gradient-to-br from-cyber-green to-accent-blue text-black shadow-lg'
                          : 'bg-darker-surface text-gray-400'
                      "
                    >
                      <i v-if="currentStep > 2" class="fas fa-check text-xs"></i>
                      <span v-else>2</span>
                    </div>
                    <span
                      class="text-xs font-medium"
                      :class="currentStep >= 2 ? 'text-white' : 'text-gray-400'"
                      >Thanh toán</span
                    >
                  </div>

                  <div class="flex flex-col items-center">
                    <div
                      class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs mb-1 transition-all duration-300"
                      :class="
                        currentStep >= 3
                          ? 'bg-gradient-to-br from-cyber-green to-accent-blue text-black shadow-lg'
                          : 'bg-darker-surface text-gray-400'
                      "
                    >
                      3
                    </div>
                    <span
                      class="text-xs font-medium"
                      :class="currentStep >= 3 ? 'text-white' : 'text-gray-400'"
                      >Hoàn thành</span
                    >
                  </div>
                </div>
              </div>
            </div>

            <!-- Content Area - Scrollable -->
            <div class="flex-1 overflow-y-auto px-6 py-4">
              <!-- Step 1: Confirmation Form -->
              <div v-if="currentStep === 1">
                <div class="grid grid-cols-2 gap-4">
                  <!-- Left Column -->
                  <div class="space-y-3">
                    <!-- Tournament Info - Compact -->
                    <div
                      class="bg-darker-surface/50 border border-accent-blue/20 rounded-lg p-3"
                    >
                      <h3 class="font-semibold text-white text-sm mb-2">
                        Thông tin giải đấu
                      </h3>
                      <div class="space-y-1.5 text-xs">
                        <div class="flex justify-between">
                          <span class="text-gray-400">Giải đấu</span>
                          <span class="font-medium text-white">{{
                            tournamentInfo.name
                          }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-gray-400">Bắt đầu</span>
                          <span class="font-medium text-white">{{
                            tournamentInfo.startDate
                          }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-gray-400">Lệ phí</span>
                          <span class="font-medium text-amber-400"
                            >500.000 VNĐ</span
                          >
                        </div>
                        <div class="flex justify-between">
                          <span class="text-gray-400">Slots</span>
                          <span class="font-medium text-white"
                            >{{ tournamentInfo.currentPlayers }}/{{
                              tournamentInfo.maxPlayers
                            }}</span
                          >
                        </div>
                      </div>
                    </div>

                    <!-- Terms - Compact -->
                    <div
                      class="bg-accent-blue/10 border border-accent-blue/30 rounded-lg p-3"
                    >
                      <div class="space-y-2">
                        <label
                          class="flex items-start space-x-2 cursor-pointer group"
                        >
                          <input
                            v-model="acceptedTerms"
                            type="checkbox"
                            class="mt-0.5 w-4 h-4 rounded border-gray-400 text-accent-blue focus:ring-accent-blue focus:ring-offset-0 bg-darker-surface"
                          />
                          <span
                            class="text-xs text-gray-300 group-hover:text-white transition-colors"
                            >Tôi đồng ý tuân thủ
                            <a href="#" class="text-accent-blue hover:underline"
                              >thể lệ</a
                            >
                            và thi đấu đúng lịch.</span
                          >
                        </label>

                        <label
                          class="flex items-start space-x-2 cursor-pointer group"
                        >
                          <input
                            v-model="acceptedRisk"
                            type="checkbox"
                            class="mt-0.5 w-4 h-4 rounded border-gray-400 text-accent-blue focus:ring-accent-blue focus:ring-offset-0 bg-darker-surface"
                          />
                          <span
                            class="text-xs text-gray-300 group-hover:text-white transition-colors"
                            >Tôi hiểu Elite Gamer không chịu trách nhiệm về giải đấu
                            giả mạo.</span
                          >
                        </label>
                      </div>
                    </div>

                    <!-- Warning - Compact -->
                    <div
                      class="bg-amber-500/10 border border-amber-500/30 rounded-lg p-2.5"
                    >
                      <div class="flex items-start space-x-2">
                        <i
                          class="fas fa-exclamation-triangle text-amber-400 mt-0.5 text-xs"
                        ></i>
                        <div class="text-xs text-gray-300">
                          <span class="font-semibold text-amber-400">Lưu ý:</span>
                          Hoàn thành thanh toán trong 24h, nếu không đăng ký sẽ bị
                          hủy.
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Right Column -->
                  <div>
                    <!-- Registration Form - Compact -->
                    <div
                      class="bg-darker-surface/50 border border-accent-blue/20 rounded-lg p-3"
                    >
                      <h3 class="font-semibold text-white text-sm mb-3">
                        Thông tin đăng ký (bỏ trống nếu bạn đăng ký cho bản thân)
                      </h3>
                      <div class="space-y-2.5">
                        <div>
                          <label class="block text-xs text-gray-400 mb-1"
                            >Người chơi <span class="text-red-400">*</span></label
                          >
                          <input
                            v-model="registrationForm.playerName"
                            type="text"
                            placeholder="Nhập tên người chơi"
                            class="w-full bg-darker-surface border border-accent-blue/20 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-accent-blue/40 focus:outline-none transition-colors"
                          />
                        </div>

                        <div>
                          <label class="block text-xs text-gray-400 mb-1"
                            >Email <span class="text-red-400">*</span></label
                          >
                          <input
                            v-model="registrationForm.email"
                            type="email"
                            placeholder="email@example.com"
                            class="w-full bg-darker-surface border border-accent-blue/20 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-accent-blue/40 focus:outline-none transition-colors"
                          />
                        </div>

                        <div>
                          <label class="block text-xs text-gray-400 mb-1"
                            >Số điện thoại <span class="text-red-400">*</span></label
                          >
                          <input
                            v-model="registrationForm.phone"
                            type="tel"
                            placeholder="0123456789"
                            class="w-full bg-darker-surface border border-accent-blue/20 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-accent-blue/40 focus:outline-none transition-colors"
                          />
                        </div>

                        <div>
                          <label class="block text-xs text-gray-400 mb-1"
                            >Discord ID</label
                          >
                          <input
                            v-model="registrationForm.discordId"
                            type="text"
                            placeholder="username#1234"
                            class="w-full bg-darker-surface border border-accent-blue/20 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-accent-blue/40 focus:outline-none transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 2: Payment -->
              <div v-if="currentStep === 2">
                <div class="grid grid-cols-2 gap-4">
                  <!-- Left: Payment Info -->
                  <div class="space-y-3">
                    <div
                      class="bg-darker-surface/50 border border-accent-blue/20 rounded-lg p-3"
                    >
                      <h3 class="font-semibold text-white text-sm mb-2">
                        Thông tin thanh toán
                      </h3>
                      <div class="space-y-1.5 text-xs">
                        <div class="flex justify-between">
                          <span class="text-gray-400">Giải đấu</span>
                          <span class="font-medium text-white">{{
                            tournamentInfo.name
                          }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-gray-400">Tên đội</span>
                          <span class="font-medium text-white">{{
                            registrationForm.teamName
                          }}</span>
                        </div>
                        <div
                          class="flex justify-between items-center pt-2 border-t border-accent-blue/20"
                        >
                          <span class="text-gray-400 font-semibold"
                            >Tổng thanh toán</span
                          >
                          <span class="font-bold text-lg text-amber-400"
                            >500.000 VNĐ</span
                          >
                        </div>
                      </div>
                    </div>

                    <!-- Banking Info -->
                    <div
                      class="bg-darker-surface/50 border border-accent-blue/20 rounded-lg p-3"
                    >
                      <h3 class="font-semibold text-white text-sm mb-2">
                        Thông tin chuyển khoản
                      </h3>
                      <div class="space-y-1.5 text-xs">
                        <div class="flex justify-between">
                          <span class="text-gray-400">Ngân hàng</span>
                          <span class="font-medium text-white">Vietcombank</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-gray-400">STK</span>
                          <span class="font-medium text-white">1234567890</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-gray-400">Chủ TK</span>
                          <span class="font-medium text-white"
                            >Elite Gamer Arena</span
                          >
                        </div>
                        <div class="flex justify-between">
                          <span class="text-gray-400">Nội dung</span>
                          <span class="font-medium text-cyber-green text-xs"
                            >WINTER2025 {{ registrationForm.teamName }}</span
                          >
                        </div>
                      </div>
                    </div>

                    <div
                      class="bg-accent-blue/10 border border-accent-blue/30 rounded-lg p-2.5"
                    >
                      <div class="flex items-start space-x-2">
                        <i
                          class="fas fa-info-circle text-accent-blue mt-0.5 text-xs"
                        ></i>
                        <div class="text-xs text-gray-300">
                          BTC sẽ xác nhận thanh toán trong 2-24 giờ. Email thông báo
                          sẽ được gửi khi duyệt.
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Right: QR Code -->
                  <div
                    class="bg-gradient-to-br from-cyber-purple/20 to-accent-blue/20 border border-accent-blue/30 rounded-lg p-4"
                  >
                    <div class="text-center">
                      <h3 class="font-semibold text-white text-sm mb-1">
                        Quét mã QR thanh toán
                      </h3>
                      <p class="text-xs text-gray-400 mb-3">
                        Sử dụng app ngân hàng
                      </p>

                      <div class="inline-block bg-white p-3 rounded-xl">
                        <img
                          src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=Banking%20Transfer%20500000%20VND"
                          alt="QR Code"
                          class="w-48 h-48"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Step 3: Completion -->
              <div v-if="currentStep === 3">
                <div class="text-center py-4">
                  <div
                    class="w-20 h-20 bg-gradient-to-br from-cyber-green to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-cyber-green/50"
                  >
                    <i class="fas fa-check text-white text-3xl"></i>
                  </div>

                  <h3
                    class="text-2xl font-bold text-white mb-2"
                    style="font-family: Orbitron, sans-serif"
                  >
                    Đăng ký thành công!
                  </h3>
                  <p class="text-sm text-gray-400 mb-6 max-w-md mx-auto">
                    Cảm ơn bạn đã đăng ký. Email xác nhận đã được gửi đến
                    <span class="text-white font-medium">{{
                      registrationForm.email
                    }}</span>
                  </p>

                  <div class="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                    <!-- Registration Summary -->
                    <div
                      class="bg-darker-surface/50 border border-accent-blue/20 rounded-lg p-4 text-left"
                    >
                      <h4 class="font-semibold text-white text-sm mb-3">
                        Thông tin đăng ký
                      </h4>
                      <div class="space-y-2 text-xs">
                        <div class="flex justify-between">
                          <span class="text-gray-400">Mã đăng ký</span>
                          <span class="font-medium text-cyber-green"
                            >#REG{{ Math.floor(Math.random() * 10000) }}</span
                          >
                        </div>
                        <div class="flex justify-between">
                          <span class="text-gray-400">Giải đấu</span>
                          <span class="font-medium text-white">{{
                            tournamentInfo.name
                          }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-gray-400">Tên đội</span>
                          <span class="font-medium text-white">{{
                            registrationForm.teamName
                          }}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-gray-400">Trạng thái</span>
                          <span class="font-medium text-amber-400"
                            >Chờ xác nhận</span
                          >
                        </div>
                      </div>
                    </div>

                    <!-- Next Steps -->
                    <div
                      class="bg-accent-blue/10 border border-accent-blue/30 rounded-lg p-4 text-left"
                    >
                      <h4 class="font-semibold text-white text-sm mb-3 flex items-center">
                        <i class="fas fa-list-check text-accent-blue mr-2"></i>
                        Các bước tiếp theo
                      </h4>
                      <ul class="space-y-2 text-xs text-gray-300">
                        <li class="flex items-start">
                          <i
                            class="fas fa-check-circle text-cyber-green mr-2 mt-0.5"
                          ></i>
                          <span>Kiểm tra email xác nhận</span>
                        </li>
                        <li class="flex items-start">
                          <i class="fas fa-clock text-amber-400 mr-2 mt-0.5"></i>
                          <span>Chờ BTC duyệt (2-24h)</span>
                        </li>
                        <li class="flex items-start">
                          <i
                            class="fas fa-discord text-accent-blue mr-2 mt-0.5"
                          ></i>
                          <span>Tham gia Discord server</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer Actions - Compact -->
            <div class="px-6 py-3 border-t border-accent-blue/20">
              <div class="flex gap-2">
                <button
                  v-if="currentStep === 2"
                  @click="prevStep"
                  class="flex-1 bg-darker-surface hover:bg-darker-surface/70 border border-accent-blue/20 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-white"
                >
                  <i class="fas fa-arrow-left mr-2"></i>Quay lại
                </button>

                <DialogClose
                  v-if="currentStep < 3"
                  class="flex-1 bg-darker-surface hover:bg-darker-surface/70 border border-accent-blue/20 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 text-white"
                >
                  Hủy
                </DialogClose>

                <button
                  v-if="currentStep === 1"
                  @click="nextStep"
                  :disabled="
                    !acceptedTerms ||
                    !acceptedRisk ||
                    !registrationForm.teamName ||
                    !registrationForm.playerName ||
                    !registrationForm.email ||
                    !registrationForm.phone
                  "
                  class="flex-1 bg-gradient-to-r from-cyber-green to-accent-blue hover:from-cyber-green/80 hover:to-accent-blue/80 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed px-4 py-2.5 rounded-lg text-sm font-bold text-black disabled:text-gray-400 transition-all duration-200 shadow-lg"
                >
                  Tiếp tục <i class="fas fa-arrow-right ml-2"></i>
                </button>

                <button
                  v-if="currentStep === 2"
                  @click="nextStep"
                  class="flex-1 bg-gradient-to-r from-cyber-green to-accent-blue hover:from-cyber-green/80 hover:to-accent-blue/80 px-4 py-2.5 rounded-lg text-sm font-bold text-black transition-all duration-200 shadow-lg"
                >
                  <i class="fas fa-check mr-2"></i>Tôi đã thanh toán
                </button>

                <button
                  v-if="currentStep === 3"
                  @click="closeDialog"
                  class="flex-1 bg-gradient-to-r from-cyber-green to-accent-blue hover:from-cyber-green/80 hover:to-accent-blue/80 px-4 py-2.5 rounded-lg text-sm font-bold text-black transition-all duration-200 shadow-lg"
                >
                  Hoàn thành
                </button>
              </div>
            </div>

            <DialogClose
              class="absolute right-3 top-3 rounded-lg p-1.5 hover:bg-white/10 transition-colors"
            >
              <i class="fas fa-times text-gray-400 text-sm"></i>
            </DialogClose>
          </DialogContent>
        </DialogPortal>
      </DialogRoot>

      <!-- FontAwesome for icons -->
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
      />
    </body>
  </ClientOnly>
</template>

<style scoped>
body {
  background: linear-gradient(180deg, #061322 0%, #071022 30%, #0d1624 100%);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: "IBM Plex Sans", sans-serif;
}
</style>