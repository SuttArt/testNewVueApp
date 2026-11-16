import { parseTrainMessage } from './trainValidation.js'

// Transport is independent of Vue and Pinia, so every presentation shares it.
export function createTrainSocket({
  url,
  onTrain,
  onStatus,
  onError,
  retryDelay = 2000,
  WebSocketImpl = globalThis.WebSocket,
}) {
  let socket = null
  let retryTimer = null
  let active = false

  function open() {
    onStatus('connecting')
    let current
    try {
      current = new WebSocketImpl(url)
    } catch (error) {
      onStatus('error')
      onError(error.message)
      active = false
      return
    }
    socket = current
    const isCurrent = () => active && socket === current

    current.addEventListener('open', () => {
      if (!isCurrent()) return
      onStatus('connected')
      onError(null)
    })

    current.addEventListener('message', (event) => {
      if (!isCurrent()) return
      let train
      try {
        train = parseTrainMessage(event.data)
      } catch (error) {
        onError(`Invalid train update: ${error.message}`)
        return
      }
      onTrain(train)
      onError(null)
    })

    current.addEventListener('error', () => {
      if (isCurrent()) onError('WebSocket connection failed.')
    })

    current.addEventListener('close', () => {
      if (!isCurrent()) return
      socket = null
      onStatus('reconnecting')
      retryTimer = setTimeout(() => {
        retryTimer = null
        if (active) open()
      }, retryDelay)
    })
  }

  return {
    connect() {
      if (active) return
      active = true
      open()
    },
    disconnect() {
      active = false
      clearTimeout(retryTimer)
      retryTimer = null
      const previous = socket
      socket = null
      previous?.close()
      onStatus('disconnected')
    },
  }
}
