import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { parse } from 'dotenv'
import { expand } from 'dotenv-expand'

export function loadEnvironment(directory, projectId, environment = process.env) {
  const values = {}
  for (const file of ['.env', '.env.local', `.env.${projectId}`, `.env.${projectId}.local`]) {
    const filename = path.join(directory, file)
    if (existsSync(filename)) Object.assign(values, parse(readFileSync(filename)))
  }
  // Include all file values before expansion to support forward references.
  // Isolate the environment so sequential project builds cannot affect each other.
  return expand({ parsed: values, processEnv: { ...values, ...environment } }).parsed
}
