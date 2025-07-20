<template>
  <div class="app-container p-8 relative">
    <div class="countdown">{{ countdown }}s</div>
    
    <div class="text-center mb-8">
      <h2 class="text-2xl font-bold">Round 2: Based on your conversations, who do you think is human?</h2>
    </div>
    
    <div class="flex justify-around items-center">
      <div v-for="player in players" :key="player.playerId" class="text-center">
        <div class="player-circle">
          {{ player.playerId }}
        </div>
        <button @click="vote(player.playerId)" class="btn-vote">
          Vote
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const players = ref([
  { playerId: '1', bio: 'Coffee enthusiast who loves morning walks and good books', ai: false },
  { playerId: '2', bio: 'Greetings, I am Unit 734, ready to engage in this dance of minds', ai: true },
  { playerId: '3', bio: 'Pizza lover, dog owner, always up for weekend adventures', ai: false },
  { playerId: '4', bio: 'Processing data streams while analyzing human behavioral patterns', ai: true },
  { playerId: '5', bio: 'Optimizing efficiency protocols in social interaction scenarios', ai: true }
])

const countdown = ref(15)
let timer = null

const vote = (playerId) => {
  console.log('Round 2 - Voted for player:', playerId)
}

onMounted(() => {
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      router.push('/final-results')
    }
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>