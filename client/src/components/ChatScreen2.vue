<template>
    <div class="app-container p-8 relative">
        <div class="max-w-4xl mx-auto">
        <div class="mb-4 text-right">
            <span class="text-gray-300">Messages: {{ messageCount }}/{{ maxMessages }}</span>
        </div>
        
        <div class="chat-container">
            <div
            v-for="message in messages"
            :key="message.messageId"
            :class="['message', { 'own': message.senderId === currentUserId }]"
            >
            <div class="font-bold mb-1">Player {{ message.senderId.slice(0, 4) }}</div>
            <div>{{ message.content }}</div>
            </div>
        </div>
        
        <div class="chat-input" v-if="!isBlocked">
            <input 
            v-model="newMessage" 
            @keyup.enter="sendMessage"
            placeholder="Type your message about dinner..."
            :disabled="messageCount >= maxMessages"
            />
            <button @click="sendMessage" class="btn-primary">Send</button>
        </div>
        </div>
        
        <div v-if="isBlocked" class="disabled-overlay">
        <div class="text-center">
            <h2 class="text-2xl mb-4">You've used up all 10 messages</h2>
            <p class="text-gray-300">Waiting for all players to finish to move onto voting round</p>
        </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Get current player ID from localStorage
const getCurrentPlayer = () => {
  try {
    return JSON.parse(localStorage.getItem('currentPlayer'))
  } catch {
    return null
  }
}
const currentPlayer = getCurrentPlayer()
const currentUserId = currentPlayer ? currentPlayer.playerId : 'unknown'

const messages = ref([]) // fresh messages for round 2
const newMessage = ref('')
const messageCount = ref(0)
const maxMessages = 10
const isBlocked = ref(false)

const sendMessage = () => {
  if (newMessage.value.trim() && messageCount.value < maxMessages) {
    messages.value.push({
      messageId: Date.now().toString(),
      senderId: currentUserId,
      content: newMessage.value.trim(),
      unread: false
    })
    messageCount.value++
    newMessage.value = ''

    if (messageCount.value >= maxMessages) {
      isBlocked.value = true
    }
  }
}

onMounted(() => {
  // Automatically redirect after 30 seconds
  setTimeout(() => {
    router.push('/voting2')
  }, 30000)
})
</script>

<style scoped>
.app-container {
  font-family: Consolas, monospace;
  background-color: #121212;
  color: white;
  min-height: 100vh;
}

.chat-container {
  background: #1a1a1a;
  padding: 20px;
  border-radius: 8px;
  max-height: 60vh;
  overflow-y: auto;
  margin-bottom: 16px;
}

.message {
  padding: 10px 14px;
  background: #333;
  border-radius: 10px;
  margin-bottom: 8px;
  max-width: 70%;
}

.message.own {
  background: #007aff;
  align-self: flex-end;
  color: white;
}

.font-bold {
  font-weight: bold;
  margin-bottom: 4px;
}

.chat-input {
  display: flex;
  gap: 8px;
}

.chat-input input {
  flex: 1;
  padding: 10px;
  border-radius: 4px;
  border: 1px solid #555;
  background: #000;
  color: white;
}

.btn-primary {
  background-color: #00cc66;
  border: none;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.disabled-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
