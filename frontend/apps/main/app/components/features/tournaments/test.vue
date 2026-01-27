<script setup lang="ts">
import { ref } from 'vue'
import {
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectViewport,
  SelectItem,
} from 'radix-vue'

const selectedMonth = ref<string | null>(null)
const selectedYear = ref<string | null>(null)

const months = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]

const years = Array.from({ length: 30 }, (_, i) => String(2000 + i))
</script>

<template>
  <div class="flex gap-4 items-center">
    <!-- Month Picker -->
    <SelectRoot v-model="selectedMonth">
      <SelectTrigger
        class="px-4 py-2 rounded-md text-white font-semibold
               bg-gradient-to-r from-cyber-green to-accent-blue
               shadow-lg shadow-cyan-500/50 hover:scale-105 transition"
      >
        <SelectValue placeholder="Select Month" />
      </SelectTrigger>
      <SelectContent
        class="bg-black border border-cyan-400 rounded-md shadow-xl"
      >
        <SelectViewport>
          <SelectItem
            v-for="month in months"
            :key="month"
            :value="month"
            class="px-3 py-2 cursor-pointer text-cyan-300 hover:bg-cyan-900"
          >
            {{ month }}
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectRoot>

    <!-- Year Picker -->
    <SelectRoot v-model="selectedYear">
      <SelectTrigger
        class="px-4 py-2 rounded-md text-white font-semibold
               bg-gradient-to-r from-cyber-green to-accent-blue
               shadow-lg shadow-blue-500/50 hover:scale-105 transition"
      >
        <SelectValue placeholder="Select Year" />
      </SelectTrigger>
      <SelectContent
        class="bg-black border border-blue-400 rounded-md shadow-xl"
      >
        <SelectViewport>
          <SelectItem
            v-for="year in years"
            :key="year"
            :value="year"
            class="px-3 py-2 cursor-pointer text-blue-300 hover:bg-blue-900"
          >
            {{ year }}
          </SelectItem>
        </SelectViewport>
      </SelectContent>
    </SelectRoot>
  </div>

  <!-- Preview -->
  <div class="mt-6 text-lg text-cyan-200">
    Selected: {{ selectedMonth }} {{ selectedYear }}
  </div>
</template>
