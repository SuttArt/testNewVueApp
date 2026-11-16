// Matches WS_Server/schemas/train.schema.json, including additionalProperties: false.
const stationFields = ['StationName', 'StationType', 'ArrivalTime', 'DepartureTime']
const trainFields = ['TrainType', 'TrainNumber', 'TrainDestination', 'CurrentStation', 'ListOfStations']

function hasExactFields(value, fields) {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    && Object.keys(value).length === fields.length
    && fields.every((field) => Object.hasOwn(value, field))
}

function isStation(value) {
  return hasExactFields(value, stationFields)
    && stationFields.every((field) => typeof value[field] === 'string')
}

export function parseTrainMessage(message) {
  const train = JSON.parse(message)
  if (!hasExactFields(train, trainFields)
    || typeof train.TrainType !== 'string'
    || typeof train.TrainNumber !== 'number'
    || !Number.isFinite(train.TrainNumber)
    || typeof train.TrainDestination !== 'string'
    || !isStation(train.CurrentStation)
    || !Array.isArray(train.ListOfStations)
    || !train.ListOfStations.every(isStation)) {
    throw new Error('WebSocket message does not match the train schema.')
  }
  return train
}
