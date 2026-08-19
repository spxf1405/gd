<!-- TODO: redesign this page -->

<script setup lang="ts">
import {
    Award,
    ChevronRight,
    CircleDot,
    Medal,
    Target,
    TrendingUp,
    Trophy
} from "@lucide/vue";

const player = {
  name: "Ko Pin Yi",
  nationality: "TW",
  countryName: "Chinese Taipei",
  ranking: "PRO",
  worldRank: 12,
  rating: 847,
  avatar:
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
};

const stats = [
  {
    label: "Matches",
    value: "TBD",
    icon: Target,
  },
  {
    label: "Win Rate",
    value: "TBD",
    icon: TrendingUp,
  },
  {
    label: "Wins",
    value: "TBD",
    icon: CircleDot,
  },
  {
    label: "Titles",
    value: "TBD",
    icon: Trophy,
  },
];

const recentMatches = [
  {
    opponent: "Fedor Gorst",
    opponentCountry: "US",
    result: "W",
    score: "11 - 8",
    tournament: "World Pool Masters",
    date: "Aug 16, 2026",
  },
  {
    opponent: "Joshua Filler",
    opponentCountry: "DE",
    result: "W",
    score: "9 - 7",
    tournament: "Asian Open",
    date: "Aug 12, 2026",
  },
  {
    opponent: "Aloysius Yapp",
    opponentCountry: "SG",
    result: "L",
    score: "6 - 9",
    tournament: "Asian Open",
    date: "Aug 10, 2026",
  },
  {
    opponent: "Carlo Biado",
    opponentCountry: "PH",
    result: "W",
    score: "11 - 5",
    tournament: "World 9-Ball Championship",
    date: "Aug 03, 2026",
  },
];

const achievements = [
  {
    year: "2025",
    title: "World 9-Ball Champion",
    event: "WPA World Championship",
  },
  {
    year: "2024",
    title: "Asian 9-Ball Champion",
    event: "Asian Pool Championship",
  },
  {
    year: "2022",
    title: "Asian 9-Ball Open Champion",
    event: "APF Asian 9-Ball Open",
  },
  {
    year: "2015",
    title: "World 10-Ball Champion",
    event: "WPA World 10-Ball Championship",
  },
];
</script>

<template>
  <div class="min-h-screen bg-[#0b0d12] text-white">
    <!-- Header -->
    <header
      class="border-b border-white/[0.06] bg-[#0b0d12]/90 backdrop-blur-xl"
    >
      <div
        class="mx-auto flex h-16 max-w-7xl items-center justify-between px-6"
      >
        <div class="flex items-center gap-3">
          <div
            class="flex size-9 items-center justify-center rounded-lg bg-white/[0.06]"
          >
            <Trophy class="size-4 text-amber-400" />
          </div>

          <span class="text-sm font-semibold tracking-wide">
            PLAYER PROFILE
          </span>
        </div>

        <button
          class="rounded-lg border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm text-white/70 transition hover:bg-white/[0.07] hover:text-white"
        >
          Back
        </button>
      </div>
    </header>

    <main class="mx-auto max-w-7xl px-6 py-8">
      <!-- HERO -->
      <section
        class="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#11141b]"
      >
        <!-- decorative background -->
        <div
          class="pointer-events-none absolute -right-32 -top-40 size-[500px] rounded-full bg-amber-400/[0.05] blur-3xl"
        />

        <div class="relative px-6 py-8 sm:px-8">
          <div class="flex flex-col gap-8 sm:flex-row sm:items-center">
            <!-- Avatar -->
            <div class="relative shrink-0">
              <div
                class="size-28 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] sm:size-32"
              >
                <img
                  :src="player.avatar"
                  :alt="player.name"
                  class="size-full object-cover"
                />
              </div>

              <div
                class="absolute -bottom-3 -right-3 flex size-9 items-center justify-center rounded-full border-4 border-[#11141b] bg-amber-400 text-black"
              >
                <Trophy class="size-4" />
              </div>
            </div>

            <!-- Player info -->
            <div class="min-w-0 flex-1">
              <div class="mb-3 flex flex-wrap items-center gap-2">
                <span
                  class="rounded-md border border-amber-400/20 bg-amber-400/10 px-2.5 py-1 text-[11px] font-bold tracking-wider text-amber-400"
                >
                  PROFESSIONAL
                </span>

                <span
                  class="rounded-md border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-white/50"
                >
                  9-BALL
                </span>
              </div>

              <h1
                class="text-3xl font-bold tracking-tight text-white sm:text-4xl"
              >
                {{ player.name }}
              </h1>

              <div class="mt-3 flex flex-wrap items-center gap-4 text-sm">
                <div class="flex items-center gap-2 text-white/60">
                  <img
                    :src="`https://flagcdn.com/24x18/${player.nationality.toLowerCase()}.png`"
                    class="h-[18px] w-6 rounded-sm object-cover"
                    :alt="player.countryName"
                  />
                  <span>{{ player.countryName }}</span>
                </div>

                <span class="h-1 w-1 rounded-full bg-white/20" />

                <span class="text-white/40">
                  World Rank
                  <strong class="ml-1 text-white">
                    #{{ player.worldRank }}
                  </strong>
                </span>

                <span class="h-1 w-1 rounded-full bg-white/20" />

                <span class="text-white/40">
                  Rating
                  <strong class="ml-1 text-white">
                    {{ player.rating }}
                  </strong>
                </span>
              </div>
            </div>

            <!-- Rank -->
            <div
              class="hidden min-w-32 border-l border-white/[0.07] pl-8 text-right sm:block"
            >
              <div class="text-xs uppercase tracking-widest text-white/30">
                World Rank
              </div>

              <div class="mt-1 text-4xl font-bold tracking-tight">
                #{{ player.worldRank }}
              </div>

              <div class="mt-1 text-xs text-emerald-400">
                ↑ 3 places
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- STATS -->
      <section class="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div
          v-for="stat in stats"
          :key="stat.label"
          class="group rounded-xl border border-white/[0.07] bg-[#11141b] p-5 transition hover:border-white/[0.12]"
        >
          <div class="flex items-center justify-between">
            <span class="text-xs font-medium uppercase tracking-wider text-white/35">
              {{ stat.label }}
            </span>

            <component
              :is="stat.icon"
              class="size-4 text-white/25 transition group-hover:text-amber-400"
            />
          </div>

          <div class="mt-3 text-2xl font-bold tracking-tight">
            {{ stat.value }}
          </div>
        </div>
      </section>

      <!-- CONTENT -->
      <div class="mt-5 grid gap-5">
        <!-- LEFT -->
      

        <!-- RIGHT -->
        <aside class="space-y-5">
          <!-- Achievements -->
          <section
            class="rounded-xl border border-white/[0.07] bg-[#11141b]"
          >
            <div class="border-b border-white/[0.06] px-5 py-4">
              <div class="flex items-center gap-2">
                <Award class="size-4 text-amber-400" />
                <h2 class="font-semibold">Achievements</h2>
              </div>

              <p class="mt-1 text-xs text-white/35">
                Career highlights
              </p>
            </div>

            <div class="divide-y divide-white/[0.05]">
              <div
                v-for="achievement in achievements"
                :key="achievement.title"
                class="flex gap-3 px-5 py-4"
              >
                <div
                  class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-400/10"
                >
                  <Medal class="size-4 text-amber-400" />
                </div>

                <div class="min-w-0">
                  <div class="flex items-center justify-between gap-2">
                    <span class="text-xs font-medium text-white/35">
                      {{ achievement.year }}
                    </span>
                  </div>

                  <div class="mt-1 text-sm font-medium">
                    {{ achievement.title }}
                  </div>

                  <div class="mt-1 text-xs text-white/30">
                    {{ achievement.event }}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Player info -->
          <section
            class="rounded-xl border border-white/[0.07] bg-[#11141b] p-5"
          >
            <h2 class="font-semibold">Player Information</h2>

            <div class="mt-5 space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm text-white/40">
                  Nationality
                </span>

                <div class="flex items-center gap-2 text-sm">
                  <img
                    :src="`https://flagcdn.com/24x18/${player.nationality.toLowerCase()}.png`"
                    class="h-[18px] w-6 rounded-sm"
                  />
                  {{ player.countryName }}
                </div>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-sm text-white/40">
                  Category
                </span>

                <span class="text-sm font-medium">
                  Professional
                </span>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-sm text-white/40">
                  Discipline
                </span>

                <span class="text-sm font-medium">
                  9-Ball
                </span>
              </div>

              <div class="flex items-center justify-between">
                <span class="text-sm text-white/40">
                  Member since
                </span>

                <span class="text-sm font-medium">
                  2022
                </span>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </main>
  </div>
</template>