import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'

// Import components
import LandingScreen from './components/LandingScreen.vue'
import GettingStarted from './components/GettingStarted.vue'
import StartGame from './components/StartGame.vue'
import ChatScreen from './components/ChatScreen.vue'
import VotingScreen from './components/VotingScreen.vue'
import ResultsScreen from './components/ResultsScreen.vue'
import Round2Prompt from './components/Round2Prompt.vue'
import ChatScreen2 from './components/ChatScreen2.vue'
import VotingScreen2 from './components/VotingScreen2.vue'
// import VotingScreen2 from './components/VotingScreen2.vue'
import FinalResults from './components/FinalResults.vue'

const routes = [
    { path: '/', component: LandingScreen },
    { path: '/getting-started', component: GettingStarted },
    { path: '/start-game', component: StartGame },
    { path: '/chat', component: ChatScreen },
    { path: '/voting', component: VotingScreen },
    { path: '/results', component: ResultsScreen },
    { path: '/round2-prompt', component: Round2Prompt },
    { path: '/chat2', component: ChatScreen2 },
    { path: '/voting2', component: VotingScreen2 },
    { path: '/final-results', component: FinalResults }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

const app = createApp(App)
app.use(router)
app.mount('#app')