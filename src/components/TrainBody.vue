<script setup>
import { computed } from 'vue'
import { useTrainStore } from '@/stores/train'

const props = defineProps({ compact: Boolean })
const trainStore = useTrainStore()
const visibleStations = computed(() => trainStore.nextStations.slice(0, props.compact ? 3 : 4))
</script>

<template>
  <div class="train-body" :class="{ compact }">
    <p v-if="!trainStore.train" class="notice" role="status">Waiting for the first train update…</p>
    <template v-else>
      <section class="current-station" aria-label="Current station">
        <p v-if="!compact" class="eyebrow">Current station</p>
        <h2>{{ trainStore.currentStation.StationName }}</h2>
        <p v-if="!compact" class="station-type">{{ trainStore.currentStation.StationType }}</p>
        <dl v-if="!compact" class="station-times">
          <div><dt>Arrival</dt><dd>{{ trainStore.currentStation.ArrivalTime || '—' }}</dd></div>
          <div><dt>Departure</dt><dd>{{ trainStore.currentStation.DepartureTime || '—' }}</dd></div>
        </dl>
      </section>
      <section class="upcoming-stations" aria-label="Next stations">
        <h2>Next stations</h2>
        <ol v-if="compact && visibleStations.length" class="station-list">
          <li v-for="(station, index) in visibleStations" :key="index">{{ station.StationName }}</li>
        </ol>
        <div v-else-if="visibleStations.length" class="table-scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">Station</th>
                <th scope="col">Type</th>
                <th scope="col">Arrival</th>
                <th scope="col">Departure</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(station, index) in visibleStations" :key="index">
                <th scope="row">{{ station.StationName }}</th>
                <td>{{ station.StationType }}</td>
                <td>{{ station.ArrivalTime || '—' }}</td>
                <td>{{ station.DepartureTime || '—' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p v-else>No upcoming stations available.</p>
      </section>
      <p v-if="trainStore.status !== 'connected'" class="notice" role="status">
        Showing the last received train update. Connection: {{ trainStore.status }}.
      </p>
    </template>
    <p v-if="trainStore.error" class="notice" role="alert">{{ trainStore.error }}</p>
  </div>
</template>

<style scoped>
.train-body { display: grid; gap: 1.5rem; }
.current-station {
  padding: clamp(1.5rem, 4vw, 3rem);
  border: 1px solid #cbd5e1;
  border-left: 0.5rem solid var(--accent, #2563eb);
  border-radius: 1rem;
  background: white;
}
.eyebrow { margin: 0 0 0.75rem; color: #475569; font-size: 1rem; }
.current-station h2 { margin: 0; font-size: clamp(2.5rem, 6vw, 5rem); line-height: 1.1; overflow-wrap: anywhere; }
.station-type { font-size: 1.25rem; color: #475569; }
.station-times { display: flex; flex-wrap: wrap; gap: 1.5rem 4rem; margin: 2rem 0 0; }
dt { color: #475569; font-size: 1rem; }
dd { margin: 0.5rem 0 0; font-size: clamp(1.75rem, 4vw, 3rem); font-weight: 600; font-variant-numeric: tabular-nums; }
.upcoming-stations { padding: clamp(1rem, 3vw, 2rem); background: white; border: 1px solid #cbd5e1; border-radius: 1rem; }
.upcoming-stations h2 { margin: 0 0 1rem; font-size: 1.25rem; }
.table-scroll { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 1rem; }
th, td { text-align: left; padding: 0.9rem 0.75rem; border-bottom: 1px solid #e2e8f0; }
thead th { color: #475569; font-size: 0.85rem; }
tbody th { font-weight: 600; }
td { font-variant-numeric: tabular-nums; }
tbody tr:last-child > * { border-bottom: 0; }
.notice { margin: 0; padding: 1rem; color: #475569; }
.compact { align-content: start; gap: 1rem; min-width: 0; }
.compact .current-station { padding: 1.25rem 1.5rem; }
.compact .current-station h2 { font-size: 2rem; }
.compact .upcoming-stations { padding: 1.5rem; }
.station-list { list-style: none; padding: 0; margin: 0; }
.station-list li { padding: 1.5rem 0; font-size: 1.5rem; overflow-wrap: anywhere; }
.station-list li + li { border-top: 1px solid #e2e8f0; }
</style>
