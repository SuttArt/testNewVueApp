<script setup>
import TrainHeader from '@/components/TrainHeader.vue'
import TrainBody from '@/components/TrainBody.vue'
import { project } from '@/config/project'
</script>

<template>
  <main class="project-page" :style="{ '--accent': project.accent }" :aria-label="project.title">
    <TrainBody />
    <TrainHeader />
  </main>
</template>

<style scoped>
main { padding: 2rem; border-left: 0.5rem solid var(--accent); background: #f0fdfa; font-family: sans-serif; color: #0f172a; display: grid; grid-template-rows: 1fr auto; align-items: start; gap: 2rem; }
</style>
