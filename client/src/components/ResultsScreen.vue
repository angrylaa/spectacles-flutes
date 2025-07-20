<template>
  <div class="app-container p-8">
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold">Round 1 Results</h2>
    </div>
    
    <div class="flex justify-around items-center">
      <div v-for="player in players" :key="player.playerId" class="text-center">
        <div class="player-circle">
          {{ player.playerId }}
        </div>
        <div class="mt-2">
          <span class="font-bold">{{ player.ai ? 'AI' : 'HUMAN' }}</span>
        </div>
        <div class="text-sm text-gray-400">
          Votes: {{ getVoteCount(player.playerId) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Dummy data - replace with Firebase query
const players = ref([
  { playerId: '1', bio: 'Coffee enthusiast who loves morning walks and good books', ai: false },
  { playerId: '2', bio: 'Greetings, I am Unit 734, ready to engage in this dance of minds', ai: true },
  { playerId: '3', bio: 'Pizza lover, dog owner, always up for weekend adventures', ai: false },
  { playerId: '4', bio: 'Processing data streams while analyzing human behavioral patterns', ai: true },
  { playerId: '5', bio: 'Optimizing efficiency protocols in social interaction scenarios', ai: true }
])

const getVoteCount = (playerId) => {
  // TODO: Calculate from Firebase votes
  return Math.floor(Math.random() * 3)
}

// Auto-navigate to next round after 10 seconds
onMounted(() => {
  setTimeout(() => {
    router.push('/round2-prompt')
  }, 10000)
})
</script>