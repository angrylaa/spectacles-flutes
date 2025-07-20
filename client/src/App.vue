<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
// Main app component - just renders router views
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Consolas:wght@400;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Consolas', monospace;
}

body {
  background: #000;
  color: #fff;
  min-height: 100vh;
  overflow-x: hidden;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.bento-box {
  background: #111;
  border: 2px solid #333;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.bento-box:hover {
  border-color: #555;
  transform: translateY(-2px);
}

.btn-primary {
  background: #fff;
  color: #000;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Consolas', monospace;
}

.btn-primary:hover {
  background: #ddd;
  transform: scale(1.05);
}

.btn-vote {
  background: transparent;
  color: #fff;
  border: 2px solid #fff;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Consolas', monospace;
}

.btn-vote:hover {
  background: #fff;
  color: #000;
}

.player-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #333, #555);
  border: 2px solid #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-bottom: 1rem;
  margin: 0 auto 1rem auto;
}

.fade-animation {
  animation: fade 2s infinite;
}

@keyframes fade {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.chat-container {
  max-height: 60vh;
  overflow-y: auto;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 1rem;
  background: #111;
}

.message {
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 6px;
  background: #222;
}

.message.own {
  background: #333;
  margin-left: 2rem;
}

.chat-input {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.chat-input input {
  flex: 1;
  padding: 0.5rem;
  background: #222;
  border: 1px solid #444;
  border-radius: 6px;
  color: #fff;
  font-family: 'Consolas', monospace;
}

.disabled-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.countdown {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  font-weight: bold;
}

.url-input {
  background: #222;
  border: 1px solid #444;
  border-radius: 6px;
  padding: 1rem;
  color: #fff;
  width: 100%;
  font-family: 'Consolas', monospace;
  margin-bottom: 1rem;
}

/* Utility classes */
.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.justify-around {
  justify-content: space-around;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.relative {
  position: relative;
}

.max-w-md {
  max-width: 28rem;
}

.max-w-2xl {
  max-width: 42rem;
}

.max-w-4xl {
  max-width: 56rem;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

.p-8 {
  padding: 2rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.mb-8 {
  margin-bottom: 2rem;
}

.mt-2 {
  margin-top: 0.5rem;
}

.mt-8 {
  margin-top: 2rem;
}

.text-sm {
  font-size: 0.875rem;
}

.text-lg {
  font-size: 1.125rem;
}

.text-xl {
  font-size: 1.25rem;
}

.text-2xl {
  font-size: 1.5rem;
}

.text-3xl {
  font-size: 1.875rem;
}

.font-bold {
  font-weight: bold;
}

.text-gray-300 {
  color: #d1d5db;
}

.text-gray-400 {
  color: #9ca3af;
}

.leading-relaxed {
  line-height: 1.625;
}

.max-w-32 {
  max-width: 8rem;
}

.break-words {
  word-wrap: break-word;
}
</style>