import { computed, onScopeDispose, ref, shallowRef } from 'vue'
import { defineStore } from 'pinia'
import { createTrainSocket } from '../services/trainSocket.js'

export const useTrainStore = defineStore('train', () => {
  const train = shallowRef(null)
  const status = ref('idle')
  const error = ref(null)
  const updatedAt = ref(null)
  const currentStation = computed(() => train.value?.CurrentStation ?? null)
  const nextStations = computed(() => {
    if (!train.value) return []
    const stations = train.value.ListOfStations
    const current = currentStation.value
    const fields = ['StationName', 'StationType', 'ArrivalTime', 'DepartureTime']
    // Prefer the full stop details to distinguish repeated visits to a station.
    let index = stations.findIndex((station) => fields.every((field) => station[field] === current[field]))
    if (index === -1) {
      index = stations.findIndex((station) => station.StationName === current.StationName)
    }
    // Without the current stop in the route, its following stops cannot be determined.
    return index === -1 ? [] : stations.slice(index + 1, index + 5)
  })
  let connection = null
  let connectionUrl = null

  function connect(url = __TRAIN_WS_URL__) {
    if (connection && connectionUrl === url && status.value !== 'error') return
    disconnect()
    connectionUrl = url
    error.value = null
    connection = createTrainSocket({
      url,
      onTrain(update) {
        train.value = update
        updatedAt.value = new Date().toISOString()
      },
      onStatus(value) { status.value = value },
      onError(value) { error.value = value },
    })
    connection.connect()
  }

  function disconnect() {
    connection?.disconnect()
    connection = null
    connectionUrl = null
    status.value = 'disconnected'
  }

  onScopeDispose(disconnect)

  return { train, currentStation, nextStations, status, error, updatedAt, connect, disconnect }
})
