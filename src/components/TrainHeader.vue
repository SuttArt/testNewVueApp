<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useTrainStore } from '@/stores/train'

const trainStore = useTrainStore()
const now = ref(new Date())
const clockFormatter = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
})
const currentTime = computed(() => clockFormatter.format(now.value))
let clockInterval

onMounted(() => {
  now.value = new Date()
  clockInterval = setInterval(() => { now.value = new Date() }, 1000)
})
onUnmounted(() => clearInterval(clockInterval))
</script>

<template>
  <header class="train-header">
    <h1 v-if="trainStore.train" class="train-number">
      {{ trainStore.train.TrainType }} {{ trainStore.train.TrainNumber }}
    </h1>
    <h1 v-else class="train-number">—</h1>
    <div class="destination">
      <span class="label">Destination</span>
      <p>{{ trainStore.train?.TrainDestination || '—' }}</p>
    </div>
    <time :datetime="now.toISOString()" aria-label="Current local time">{{ currentTime }}</time>
  </header>
</template>

<style scoped>
.train-header {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: clamp(1rem, 3vw, 3rem);
  padding: clamp(1rem, 3vw, 2rem);
  background: var(--accent, #2563eb);
  color: white;
  border-radius: 1rem;
}
.train-number { margin: 0; font-size: clamp(1.5rem, 3vw, 2.5rem); }
.label { font-size: 0.85rem; }
.destination p { margin: 0.25rem 0 0; font-size: clamp(1.5rem, 3vw, 2.5rem); font-weight: 700; overflow-wrap: anywhere; }
time { font-size: clamp(1.5rem, 3vw, 2.5rem); font-variant-numeric: tabular-nums; white-space: nowrap; }
@media (max-width: 600px) {
  .train-header { grid-template-columns: 1fr auto; }
  .destination { grid-column: 1 / -1; grid-row: 2; }
}
</style>
