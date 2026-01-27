<template>
  <div>
    <!-- Add Tournament button -->
    <button
      @click="openDialog()"
      class="bg-cyber-green hover:bg-cyber-green/80 text-white font-semibold rounded-lg px-4 py-2 mb-6"
    >
      Add Tournament
    </button>

    <!-- Tournaments Table -->
    <table class="w-full border border-accent-blue/30 rounded-lg overflow-hidden text-white">
      <thead class="bg-darker-blue/70">
        <tr>
          <th class="p-3 border border-accent-blue/30 text-left">Title</th>
          <th class="p-3 border border-accent-blue/30 text-left">Platform</th>
          <th class="p-3 border border-accent-blue/30 text-left">Region</th>
          <th class="p-3 border border-accent-blue/30 text-left">Status</th>
          <th class="p-3 border border-accent-blue/30 text-left">Start Date</th>
          <th class="p-3 border border-accent-blue/30 text-left">End Date</th>
          <th class="p-3 border border-accent-blue/30 text-left">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(tournament, index) in tournaments" :key="tournament.id" class="bg-darker-surface/90 hover:bg-darker-surface/70 transition-colors">
          <td class="p-3 border border-accent-blue/30">{{ tournament.title }}</td>
          <td class="p-3 border border-accent-blue/30">{{ tournament.platform.toUpperCase() }}</td>
          <td class="p-3 border border-accent-blue/30">{{ tournament.region.toUpperCase() }}</td>
          <td class="p-3 border border-accent-blue/30">{{ tournament.status }}</td>
          <td class="p-3 border border-accent-blue/30">{{ tournament.startDate }}</td>
          <td class="p-3 border border-accent-blue/30">{{ tournament.endDate }}</td>
          <td class="p-3 border border-accent-blue/30 whitespace-nowrap">
            <button @click="openDialog(tournament)" class="text-accent-blue hover:text-cyber-green mr-2" aria-label="Edit">
              <i class="fas fa-edit"></i>
            </button>
            <button @click="deleteTournament(index)" class="text-red-600 hover:text-red-800" aria-label="Delete">
              <i class="fas fa-trash-alt"></i>
            </button>
          </td>
        </tr>
        <tr v-if="tournaments.length === 0">
          <td colspan="7" class="text-center text-gray-400 p-4">No tournaments found.</td>
        </tr>
      </tbody>
    </table>

    <!-- Dialog Modal -->
    <div 
      v-if="dialogVisible" 
      class="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div class="bg-darker-surface rounded-xl border border-accent-blue/20 p-6 w-full max-w-lg shadow-lg relative max-h-[90vh] overflow-auto">
        <h3 class="text-lg font-bold text-white mb-4">{{ isEditing ? 'Update' : 'Add' }} Tournament</h3>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <input
            v-model="form.title"
            type="text"
            placeholder="Tournament Title"
            required
            class="w-full bg-darker-blue border border-accent-blue/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-accent-blue/40 focus:outline-none"
          />
          <textarea
            v-model="form.description"
            placeholder="Description"
            rows="3"
            class="w-full bg-darker-blue border border-accent-blue/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:border-accent-blue/40 focus:outline-none resize-y"
          ></textarea>

          <select 
            v-model="form.platform" 
            required
            class="w-full bg-darker-blue border border-accent-blue/20 rounded-lg px-4 py-2 text-white focus:border-accent-blue/40 focus:outline-none"
          >
            <option value="" disabled>Select Platform</option>
            <option value="pc">PC</option>
            <option value="console">Console</option>
          </select>

          <select 
            v-model="form.region" 
            required
            class="w-full bg-darker-blue border border-accent-blue/20 rounded-lg px-4 py-2 text-white focus:border-accent-blue/40 focus:outline-none"
          >
            <option value="" disabled>Select Region</option>
            <option value="eu">Europe</option>
            <option value="na">North America</option>
            <option value="asia">Asia</option>
          </select>

          <select
            v-model="form.status"
            required
            class="w-full bg-darker-blue border border-accent-blue/20 rounded-lg px-4 py-2 text-white focus:border-accent-blue/40 focus:outline-none"
          >
            <option value="" disabled>Select Status</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>

          <div class="flex space-x-4">
            <div class="flex-1">
              <label class="block text-gray-400 text-sm mb-1" for="startDate">Start Date</label>
              <input 
                id="startDate"
                v-model="form.startDate" 
                type="date" 
                required
                class="w-full bg-darker-blue border border-accent-blue/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-accent-blue/40 focus:outline-none"
              />
            </div>

            <div class="flex-1">
              <label class="block text-gray-400 text-sm mb-1" for="endDate">End Date</label>
              <input 
                id="endDate"
                v-model="form.endDate" 
                type="date" 
                required
                class="w-full bg-darker-blue border border-accent-blue/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:border-accent-blue/40 focus:outline-none"
              />
            </div>
          </div>

          <div class="flex justify-end space-x-4 mt-4">
            <button 
              type="button" 
              @click="closeDialog"
              class="bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg px-4 py-2 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="bg-cyber-green hover:bg-cyber-green/80 text-white font-semibold rounded-lg px-4 py-2 transition-colors"
            >
              {{ isEditing ? 'Update' : 'Add' }}
            </button>
          </div>
        </form>

        <button 
          @click="closeDialog" 
          aria-label="Close dialog"
          class="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const tournaments = ref([
  {
    id: 1,
    title: 'Cyber Championship',
    description: 'The biggest cyber gaming event in Europe.',
    platform: 'pc',
    region: 'eu',
    status: 'Upcoming',
    startDate: '2025-10-01',
    endDate: '2025-10-10',
  },
  {
    id: 2,
    title: 'Elite Warriors Invitational',
    description: 'Invite only console tournament in North America.',
    platform: 'console',
    region: 'na',
    status: 'Ongoing',
    startDate: '2025-09-10',
    endDate: '2025-09-15',
  },
])

const dialogVisible = ref(false)
const isEditing = ref(false)
const form = ref({
  id: null,
  title: '',
  description: '',
  platform: '',
  region: '',
  status: '',
  startDate: '',
  endDate: '',
})

const openDialog = (tournament = null) => {
  if (tournament) {
    form.value = { ...tournament }
    isEditing.value = true
  } else {
    form.value = {
      id: null,
      title: '',
      description: '',
      platform: '',
      region: '',
      status: '',
      startDate: '',
      endDate: '',
    }
    isEditing.value = false
  }
  dialogVisible.value = true
}

const closeDialog = () => {
  dialogVisible.value = false
}

const handleSubmit = () => {
  if (isEditing.value) {
    const index = tournaments.value.findIndex(t => t.id === form.value.id)
    if (index !== -1) {
      tournaments.value[index] = { ...form.value }
    }
  } else {
    tournaments.value.push({
      ...form.value,
      id: Date.now(),
    })
  }
  closeDialog()
}

const deleteTournament = (index) => {
  if (confirm('Are you sure you want to delete this tournament?')) {
    tournaments.value.splice(index, 1)
  }
}
</script>
