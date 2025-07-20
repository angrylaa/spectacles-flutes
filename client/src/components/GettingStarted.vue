<template>
  <div class="app-container flex items-center justify-center">
    <div class="bento-box text-center max-w-md">
      <h2 class="text-2xl font-bold mb-6">Share Game Link</h2>
      <input type="text" :value="gameUrl" class="url-input" readonly>
      <p class="fade-animation text-gray-300">
        Waiting for player 2 to join...
      </p>
      <!-- Temporary button to simulate player joining -->
      <button @click="$router.push('/start-game')" class="btn-primary mt-8">
        Simulate Player Joined
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const gameUrl = ref('https://game.example.com/join/abc123')

// In real implementation, listen for Firebase changes here
// and automatically navigate when second player joins
</script>