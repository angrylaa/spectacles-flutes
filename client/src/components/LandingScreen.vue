<template>
    <div class="app-container flex items-center justify-center">
        <div class="bento-box text-center max-w-md">
        <h1 class="text-3xl font-bold mb-4">AI vs Human</h1>
        <p class="text-gray-300 mb-4">Can you spot the human among the AI?</p>
        <p>to get started, let's introduce ourselves to our players and then have a little chat.</p>
        <textarea
            v-model="bio"
            @input="enforceWordLimit"
            placeholder="Enter your bio (max 25 words)"
            class="w-full p-3 rounded text-black mb-4"
            rows="3"
        ></textarea>
        <p class="text-sm text-gray-400 mb-4">{{ wordCount }}/25 words</p>

        <button
            @click="startGame"
            class="btn-primary"
            :disabled="wordCount > 25 || !bio.trim() || loading"
        >
            {{ loading ? 'Starting...' : 'Start Game' }}
        </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { computed } from 'vue'

const router = useRouter()
const bio = ref('')
const loading = ref(false)

const wordCount = computed(() => {
    return bio.value.trim().split(/\s+/).filter(Boolean).length
})

const enforceWordLimit = () => {
    const words = bio.value.trim().split(/\s+/).filter(Boolean)
    if (words.length > 25) {
        bio.value = words.slice(0, 25).join(' ')
    }
}

const startGame = async () => {
    loading.value = true
    console.log(bio.value.trim())
    try {
        const res = await fetch('http://localhost:3000/game-sessions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ bio: bio.value.trim() }),
        })

        if (!res.ok) {
            // Log the error response
            const errorText = await res.text()
            console.error('Server error:', res.status, errorText)
            throw new Error(`Failed to create game session: ${res.status} ${errorText}`)
        }

        const data = await res.json() // Don't forget to parse the response
        console.log('Success:', data)

        router.push('/start-game')
    } catch (err) {
        console.error('Error starting game:', err)
        alert('Something went wrong starting the game.')
    } finally {
        loading.value = false
    }
}

</script>
