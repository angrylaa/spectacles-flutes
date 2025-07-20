<template>
  <div class="chat-screen">
    <div class="sidebar">
      <div
        v-for="player in otherPlayers"
        :key="player.playerId"
        :class="['sidebar-item', { active: player.playerId === selectedChatId }]"
        @click="selectChat(player.playerId)"
      >
        {{ player.playerId.slice(0, 4) }}
      </div>
    </div>

    <div class="chat-window">
      <div class="messages">
        <div
          v-for="msg in filteredMessages"
          :key="msg.messageId"
          :class="['message', { self: msg.senderId === currentUserId }]"
        >
          {{ msg.content }}
        </div>
      </div>

      <div class="input-bar">
        <input
          v-model="newMessage"
          @keyup.enter="handleSend"
          placeholder="Type a message"
        />
        <button @click="handleSend">Send</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Dummy player list - exclude current user
const getCurrentPlayer = () => {
  try {
    return JSON.parse(localStorage.getItem('currentPlayer'))
  } catch {
    return null
  }
}

const currentPlayer = ref(getCurrentPlayer())
const currentUserId = ref(currentPlayer.value ? currentPlayer.value.playerId : null)

const otherPlayers = ref([
  // Dummy data; should come from firestore or backend
  { playerId: '1183be77-e497-41ec-94c2-e2f4631cf6d3' },
  { playerId: 'a9dfbb9e-b1f3-4cb3-b346-49e43c198f04' },
  { playerId: 'f2c86d3d-dce9-4a5c-b1cc-2ef64cd44bc6' },
  { playerId: '3f16a547-0d90-4191-b408-e2378412b832' }
])

const selectedChatId = ref(otherPlayers.value[0].playerId)
const newMessage = ref('')

// Example messages from Firestore
const messages = ref([
  {
    messageId: '1',
    content: "Hi! It's great so far, really enjoying it.",
    readAt: 1752986962333,
    recipientId: '6690dc20-7975-4a63-9272-9fdf91d856ee',
    senderId: '1183be77-e497-41ec-94c2-e2f4631cf6d3',
    timestamp: 1752986923925,
    unread: false
  },
  {
    messageId: '2',
    content: "Same here! What's your strategy?",
    readAt: 1752986982333,
    recipientId: '1183be77-e497-41ec-94c2-e2f4631cf6d3',
    senderId: '6690dc20-7975-4a63-9272-9fdf91d856ee',
    timestamp: 1752986973925,
    unread: false
  }
])

const selectChat = (id) => {
  selectedChatId.value = id
}

// Only show messages between current user and selected chat target
const filteredMessages = computed(() =>
  messages.value.filter(
    (msg) =>
      (msg.senderId === currentUserId && msg.recipientId === selectedChatId.value) ||
      (msg.senderId === selectedChatId.value && msg.recipientId === currentUserId)
  )
)

const handleSend = () => {
  if (!newMessage.value.trim()) return

  // TODO USE API INSTANTIATOR
  const message = {
    messageId: crypto.randomUUID(),
    senderId: currentUserId,
    recipientId: selectedChatId.value,
    content: newMessage.value.trim(),
    timestamp: Date.now(),
    unread: true,
    readAt: null
  }

  // TODO: FIRST VERIFY AS NOT REACHED MESSAGE THRESHOLD YET
  console.log('Sending message:', message)
  messages.value.push(message)
  newMessage.value = ''
}

// TODO: HANDLE AI RESPONSES
</script>

<style scoped>
.chat-screen {
  display: flex;
  height: 100vh;
  font-family: Consolas, monospace;
}

.sidebar {
  width: 180px;
  background: #111;
  padding: 20px;
  border-right: 1px solid #444;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar-item {
  padding: 12px;
  background: #222;
  color: white;
  cursor: pointer;
  border-radius: 4px;
  text-align: center;
}

.sidebar-item.active {
  background: #007aff;
}

.chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #1a1a1a;
  color: white;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.message {
  max-width: 70%;
  padding: 10px 14px;
  background: #333;
  border-radius: 10px;
}

.message.self {
  align-self: flex-end;
  background: #007aff;
}

.input-bar {
  padding: 16px;
  background: #222;
  display: flex;
  gap: 10px;
  border-top: 1px solid #444;
}

.input-bar input {
  flex: 1;
  padding: 10px;
  background: #000;
  color: white;
  border: 1px solid #555;
  border-radius: 4px;
}

.input-bar button {
  background: white;
  color: black;
  border: none;
  padding: 10px 16px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
