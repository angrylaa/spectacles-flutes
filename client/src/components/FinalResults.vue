<template>
    <div class="app-container p-8" style="font-family: Consolas, monospace; background-color: #121212; color: white; min-height: 100vh;">
        <div class="text-center mb-8">
        <h2 style="font-size: 2rem; font-weight: bold;">Final Results</h2>
        <p style="color: #aaa; margin-top: 0.5rem;">Game Complete!</p>
        </div>

        <div class="players-grid" style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 3rem; max-width: 900px; margin: 0 auto;">
        <div v-for="player in players" :key="player.playerId" style="text-align: center;">
            <div
            class="player-circle"
            :style="{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                backgroundColor: '#222',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                fontSize: '1.25rem',
                color: 'white',
                userSelect: 'none',
            }"
            >
            {{ player.playerId.slice(0, 3).toUpperCase() }}
            </div>
            <div style="fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.25rem'">
            {{ player.ai ? 'AI' : 'HUMAN' }}
            </div>
            <div style="color: #888; fontSize: '0.9rem'">
            Total Votes: {{ player.numberOfVotes ?? 0 }}
            </div>
        </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const getCurrentPlayer = () => {
  try {
    return JSON.parse(localStorage.getItem('currentPlayer'))
  } catch {
    return null
  }
}

const currentPlayer = ref(getCurrentPlayer())

// Replace this with your actual players from backend/firestore
const players = ref([
  {
    playerId: '1a2b3c',
    ai: false,
    numberOfVotes: 2,
  },
  {
    playerId: '4d5e6f',
    ai: true,
    numberOfVotes: 1,
  },
  {
    playerId: '7g8h9i',
    ai: true,
    numberOfVotes: 0,
  },
  {
    playerId: '0j1k2l',
    ai: false,
    numberOfVotes: 3,
  },
  {
    playerId: '3m4n5o',
    ai: true,
    numberOfVotes: 4,
  },
])
</script>
