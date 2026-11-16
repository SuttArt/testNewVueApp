<script setup>
import TrainBody from '@/components/TrainBody.vue'
import { project } from '@/config/project'
</script>

<template>
  <main class="project-page" :style="{ '--accent': project.accent }" :aria-label="project.title">
    <TrainBody compact />
    <aside class="advertising-placeholder" aria-label="Advertising space"></aside>
  </main>
</template>

<style scoped>
main {
  padding: 1rem;
  font-family: monospace;
  color: #0f172a;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1rem;
}
.advertising-placeholder {
  min-width: 0;
  background: white;
  border: 1px solid #cbd5e1;
  border-radius: 1rem;
}
</style>
