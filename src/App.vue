<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useTrainStore } from '@/stores/train'
import ProjectApp from '@project-app'
import { project } from '@/config/project'

document.title = project.title

const trainStore = useTrainStore()
onMounted(() => trainStore.connect())
onUnmounted(() => trainStore.disconnect())
</script>

<template>
  <ProjectApp />
</template>

<style>
body {
  margin: 0;
}

.project-page {
  box-sizing: border-box;
  width: 1920px;
  height: 1080px;
  margin: 0;
  overflow: auto;
}
</style>
