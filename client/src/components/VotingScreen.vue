<template>
    <div class="voting-screen">
        <h2 class="heading">Who do you think is human?</h2>
        <h3 class="heading">Think wise mate. You only get one vote. No undos in life!</h3>

        <div class="players-container">
        <div
            v-for="player in players"
            :key="player.playerId"
            class="player-box"
        >
            <div class="circle">{{ player.playerId.slice(0, 3).toUpperCase() }}</div>

            <button
            class="vote-button"
            :class="{ selected: selectedVote === player.playerId }"
            @click="selectVote(player.playerId)"
            :disabled="voteLocked"
            >
            {{ selectedVote === player.playerId ? "Voted" : "Vote" }}
            </button>
        </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const getCurrentPlayer = () => {
    try {
        return JSON.parse(localStorage.getItem('currentPlayer'))
    } catch {
        return null
    }
}

const currentPlayer = ref(getCurrentPlayer())
const currentUserId = ref(currentPlayer.value ? currentPlayer.value.playerId : null)


// Replace with live players data
const players = ref([
    { playerId: '1' },
    { playerId: '2' },
    { playerId: '3' },
    { playerId: '4' },
    { playerId: '5' }
])

const selectedVote = ref('')
const voteLocked = ref(false)

function selectVote(playerId) {
    if (voteLocked.value) return
        selectedVote.value = playerId
        voteLocked.value = true

    // 👇 Send to Firestore here
    console.log('Voted for:', playerId)
}
</script>

<style scoped>
.voting-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 40px;
    font-family: Consolas, monospace;
    background-color: #121212;
    color: white;
    min-height: 100vh;
}

.heading {
    font-size: 24px;
    margin-bottom: 40px;
}

.players-container {
    display: flex;
    gap: 40px;
    justify-content: center;
    flex-wrap: wrap;
}

.player-box {
    text-align: center;
}

.circle {
    width: 80px;
    height: 80px;
    background-color: #2a2a2a;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 12px;
    font-size: 20px;
    color: white;
}

.vote-button {
    padding: 10px 20px;
    border: none;
    background-color: white;
    color: black;
    border-radius: 5px;
    cursor: pointer;
    transition: 0.2s ease;
}

.vote-button:hover:not(:disabled) {
    background-color: #ddd;
}

.vote-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.vote-button.selected {
    background-color: #00cc66;
    color: white;
}
</style>
