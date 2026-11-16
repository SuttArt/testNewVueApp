<script setup>
import { computed } from 'vue'
import TrainHeader from '@/components/TrainHeader.vue'
import { project } from '@/config/project'
import { useTrainStore } from '@/stores/train'

const trainStore = useTrainStore()
const feedStatus = computed(() => {
  if (trainStore.error) return 'Update unavailable'
  if (trainStore.status === 'connected') return trainStore.train ? 'Connected · receiving updates' : 'Connected · awaiting train'
  return trainStore.train ? 'Reconnecting · showing last update' : 'Connecting to your journey'
})
</script>

<template>
  <main class="project-page journey" :class="`theme-${project.callOff.toLowerCase()}`"
    :style="{ '--accent': project.accent }" :aria-label="project.title">
    <div class="masthead">
      <div class="brand"><span class="brand-symbol" aria-hidden="true">↗</span>{{ project.callOff }}<span class="brand-family">BR3</span></div>
      <span class="masthead-label">Your journey, at a glance.</span>
    </div>
    <TrainHeader class="journey-header" />
    <div v-if="trainStore.train" class="journey-content">
      <section class="current-stop" aria-labelledby="current-heading">
        <div class="section-label"><span class="station-dot" aria-hidden="true"></span> Current station</div>
        <div class="current-name">
          <p class="station-type">{{ trainStore.currentStation.StationType || 'Current stop' }}</p>
          <h2 id="current-heading">{{ trainStore.currentStation.StationName }}</h2>
        </div>
        <dl class="current-times">
          <div><dt>Arrival</dt><dd>{{ trainStore.currentStation.ArrivalTime || '—' }}</dd></div>
          <div><dt>Departure</dt><dd>{{ trainStore.currentStation.DepartureTime || '—' }}</dd></div>
        </dl>
        <div class="direction">
          <span class="direction-arrow" aria-hidden="true">↗</span>
          <div><span class="section-label">Towards</span><p>{{ trainStore.train.TrainDestination || '—' }}</p></div>
        </div>
      </section>
      <section class="route" aria-labelledby="route-heading">
        <div class="route-heading"><h2 id="route-heading">Coming up</h2><span>Route overview</span></div>
        <div v-if="trainStore.nextStations.length" class="route-columns" aria-hidden="true"><span>Station</span><span>Arrival</span><span>Departure</span></div>
        <ol v-if="trainStore.nextStations.length" class="route-list">
          <li v-for="(station, index) in trainStore.nextStations" :key="index" :class="{ 'next-stop': index === 0 }">
            <span class="route-marker" aria-hidden="true"></span>
            <div class="stop-name"><span v-if="index === 0" class="next-label">Next stop</span><h3>{{ station.StationName }}</h3><p>{{ station.StationType }}</p></div>
            <div class="route-time"><span class="sr-only">Arrival: </span>{{ station.ArrivalTime || '—' }}</div>
            <div class="route-time"><span class="sr-only">Departure: </span>{{ station.DepartureTime || '—' }}</div>
          </li>
        </ol>
        <div v-else class="route-empty"><span aria-hidden="true">◎</span><p>No upcoming stations available.</p></div>
      </section>
    </div>
    <section v-else class="waiting" role="status">
      <span class="waiting-symbol" aria-hidden="true">↗</span>
      <p class="section-label">Welcome aboard</p>
      <h2>Your journey will appear here.</h2>
      <p>Waiting for the first train update…</p>
    </section>
    <footer class="journey-footer">
      <p class="connection" role="status"><span :class="{ connected: trainStore.status === 'connected' && !trainStore.error }" aria-hidden="true"></span>{{ feedStatus }}</p>
      <p v-if="trainStore.error" class="feed-error" role="alert">{{ trainStore.error }}</p>
      <span class="footer-label">{{ project.callOff }} / Passenger information</span>
    </footer>
  </main>
</template>

<style scoped>
.journey {
  --page: #f6f3eb;
  --panel: #fffdf8;
  --ink: #29261f;
  --muted: #716b60;
  --line: #ded9ce;
  --soft: #eee5d5;
  --highlight: var(--accent);
  padding: 36px 48px 24px;
  background: var(--page);
  color: var(--ink);
  font-family: 'Segoe UI', Arial, sans-serif;
  display: grid;
  grid-template-rows: 48px auto minmax(0, 1fr) auto;
  gap: 28px;
}
.theme-convergence { --page: #151820; --panel: #1e222d; --ink: #f8f4f5; --muted: #b6b7c3; --line: #383b48; --soft: #35232f; --highlight: #fb91b0; }
.theme-onit { --page: #eef0fa; --panel: #ffffff; --ink: #242447; --muted: #646582; --line: #d9dcef; --soft: #e8e7fb; }
.masthead, .brand, .route-heading, .journey-footer { display: flex; align-items: center; justify-content: space-between; }
.brand { justify-content: start; gap: 14px; font-size: 24px; font-weight: 750; letter-spacing: 0.06em; text-transform: uppercase; }
.brand-symbol { display: grid; place-items: center; width: 42px; height: 42px; background: var(--accent); border-radius: 50%; color: white; font-size: 30px; }
.brand-family { border-left: 1px solid var(--line); padding-left: 14px; color: var(--muted); font-size: 14px; font-weight: 500; }
.masthead-label { color: var(--muted); font-size: 18px; }
.journey-header { background: transparent; color: var(--ink); border-radius: 0; padding: 8px 0 28px; border-bottom: 1px solid var(--line); gap: 32px; }
.journey-header :deep(.train-number) { background: var(--accent); color: white; border-radius: 12px; padding: 20px 24px; font-size: 30px; }
.journey-header :deep(.label) { color: var(--muted); font-size: 14px; text-transform: uppercase; letter-spacing: 0.12em; }
.journey-header :deep(.destination p) { font-size: 44px; line-height: 1.15; }
.journey-header :deep(time) { font-size: 52px; font-weight: 300; letter-spacing: -0.04em; }
.journey-content { display: grid; grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.1fr); gap: 32px; min-height: 0; }
.current-stop { display: flex; flex-direction: column; padding: 36px; border: 1px solid var(--line); border-top: 6px solid var(--accent); border-radius: 20px; background: var(--panel); min-width: 0; overflow: auto; }
.section-label { display: flex; align-items: center; gap: 12px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.13em; font-weight: 650; color: var(--muted); }
.station-dot { width: 12px; height: 12px; border: 5px solid var(--highlight); border-radius: 50%; }
.current-name { margin: auto 0; padding: 28px 0; }
.station-type { margin: 0 0 14px; font-size: 18px; color: var(--muted); }
.current-name h2 { font-size: 64px; font-weight: 650; letter-spacing: -0.045em; line-height: 1.05; margin: 0; overflow-wrap: anywhere; }
.current-times { display: grid; grid-template-columns: 1fr 1fr; margin: 0 0 28px; gap: 24px; }
.current-times > div + div { border-left: 1px solid var(--line); padding-left: 28px; }
dt { color: var(--muted); font-size: 16px; margin-bottom: 8px; }
dd { margin: 0; font-size: 42px; font-weight: 600; font-variant-numeric: tabular-nums; }
.direction { display: flex; align-items: center; gap: 20px; padding: 22px; border-radius: 12px; background: var(--soft); }
.direction-arrow { font-size: 44px; color: var(--highlight); }
.direction p { margin: 6px 0 0; font-size: 23px; font-weight: 600; overflow-wrap: anywhere; }
.route { min-width: 0; padding: 12px 8px 0 16px; overflow: auto; }
.route-heading { margin-bottom: 24px; }
.route-heading h2 { font-size: 32px; letter-spacing: -0.03em; margin: 0; }
.route-heading > span { font-size: 15px; color: var(--muted); }
.route-columns, .route-list li { display: grid; grid-template-columns: minmax(0, 1fr) 115px 115px; gap: 16px; }
.route-columns { padding: 0 24px 14px 54px; color: var(--muted); font-size: 14px; }
.route-list { list-style: none; padding: 0; margin: 0; }
.route-list li { position: relative; padding: 23px 24px 23px 54px; min-height: 80px; align-items: center; }
.route-list li::before { content: ''; position: absolute; left: 15px; top: 0; bottom: 0; width: 2px; background: var(--line); }
.route-list li:first-child::before { top: 50%; }
.route-list li:last-child::before { bottom: 50%; }
.route-marker { position: absolute; left: 9px; top: calc(50% - 7px); width: 10px; height: 10px; border: 2px solid var(--muted); background: var(--page); border-radius: 50%; z-index: 1; }
.route-list .next-stop { background: var(--soft); border-radius: 14px; }
.next-stop .route-marker { border-color: var(--highlight); background: var(--highlight); }
.next-label { display: block; color: var(--highlight); text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700; font-size: 12px; margin-bottom: 7px; }
.stop-name h3 { font-size: 25px; line-height: 1.15; letter-spacing: -0.02em; margin: 0; overflow-wrap: anywhere; }
.stop-name p { color: var(--muted); font-size: 14px; margin: 6px 0 0; }
.route-time { font-size: 26px; font-weight: 600; font-variant-numeric: tabular-nums; }
.route-empty { padding: 80px 32px; text-align: center; color: var(--muted); border: 1px dashed var(--line); border-radius: 16px; }
.route-empty > span { font-size: 48px; color: var(--highlight); }
.journey-footer { gap: 24px; padding-top: 18px; border-top: 1px solid var(--line); color: var(--muted); font-size: 14px; }
.connection { display: flex; gap: 10px; align-items: center; margin: 0; }
.connection > span { width: 8px; height: 8px; border-radius: 50%; background: var(--muted); }
.connection > .connected { background: #288563; }
.feed-error { flex: 1; margin: 0; overflow-wrap: anywhere; }
.footer-label { margin-left: auto; white-space: nowrap; }
.waiting { display: flex; flex-direction: column; align-items: center; justify-content: center; border: 1px solid var(--line); border-radius: 20px; background: var(--panel); }
.waiting-symbol { color: var(--highlight); font-size: 90px; }
.waiting h2 { font-size: 48px; letter-spacing: -0.04em; margin: 12px 0; }
.waiting > p:last-child { color: var(--muted); font-size: 20px; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; border: 0; }
</style>
