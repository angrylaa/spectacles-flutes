<template>
    <div class="app-container p-8 relative">
        <div class="countdown">{{ countdown }}s</div>
        
        <div class="flex justify-around items-start mb-8">
        <div v-for="player in players" :key="player.playerId" class="text-center">
            <div class="player-circle">
            {{ player.playerId }}
            </div>
            <div class="text-sm max-w-32 break-words">
            {{ player.bio }}
            </div>
        </div>
        </div>
        
        <div class="text-center max-w-4xl mx-auto">
        <p class="text-lg leading-relaxed">
            Read everyone's bio. You have 30 seconds to message who you need to get the intel you need. 
            Remember, you can only send 10 messages (including your responses to others), so be wise AI (...or human)
        </p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Dummy data - replace with Firebase query
const players = ref([
    { playerId: '1', bio: 'Coffee enthusiast who loves morning walks and good books', ai: false },
    { playerId: '2', bio: 'Greetings, I am Unit 734, ready to engage in this dance of minds', ai: true },
    { playerId: '4', bio: 'Processing data streams while analyzing human behavioral patterns', ai: true },
    { playerId: '5', bio: 'Optimizing efficiency protocols in social interaction scenarios', ai: true }
])

const countdown = ref(10)
let timer = null

onMounted(() => {
    timer = setInterval(() => {
        countdown.value--
        if (countdown.value <= 0) {
        clearInterval(timer)
        setTimeout(() => {
            router.push('/chat')
        }, 1000)
        }
    }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>