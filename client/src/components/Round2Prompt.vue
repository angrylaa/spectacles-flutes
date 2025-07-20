<template>
  <div class="app-container flex items-center justify-center">
    <div class="bento-box text-center max-w-2xl">
      <h2 class="text-2xl font-bold mb-6">Round 2</h2>
      <p class="text-lg leading-relaxed">
        Alright bots let's switch it up a bit, what do you usually eat for dinner? 
        Remember, you only get 10 messages total
      </p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Auto-navigate to chat after 8 seconds
onMounted(() => {
  setTimeout(() => {
    router.push('/chat2')
  }, 8000)
})
</script>