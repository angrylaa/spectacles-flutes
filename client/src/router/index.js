import { createRouter, createWebHistory } from 'vue-router'
import LandingScreen from '@/components/LandingScreen.vue'
import StartGame from '@/components/StartGame.vue'
import ChatScreen from '@/components/ChatScreen.vue' // ✅ Add this
import Round2Prompt from '@/components/Round2Prompt.vue'
import VotingScreen from '@/components/VotingScreen.vue'
import VotingScreen2 from '@/components/VotingScreen2.vue'
import FinalResults from '@/components/FinalResults.vue' // ✅ Add this

const routes = [
  { path: '/', component: LandingScreen },
  { path: '/start-game', component: StartGame },
  { path: '/chat', component: ChatScreen },
  { path: '/voting', component: VotingScreen },
  { path: '/voting-rnd-2', component: VotingScreen2 },
  { path: '/prompt-rnd-2', component: Round2Prompt },
  { path: '/results', component: FinalResults },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: {
  template: '<div style="padding: 2rem; color: red;">404: Page not found</div>'
} }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
