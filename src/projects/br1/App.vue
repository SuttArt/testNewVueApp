<script setup>
import TrainHeader from '@/components/TrainHeader.vue'
import TrainBody from '@/components/TrainBody.vue'
import { project } from '@/config/project'
</script>

<template>
  <main class="project-page" :style="{ '--accent': project.accent }" :aria-label="project.title">
    <TrainHeader />
    <TrainBody />
  </main>
</template>

<style scoped>
main { padding: 1rem; font-family: sans-serif; color: #0f172a; display: grid; grid-template-rows: auto 1fr; align-items: start; gap: 1.5rem; }
</style>
