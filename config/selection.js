import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { resolveProject } from './projects.js'

export const rootDirectory = fileURLToPath(new URL('../', import.meta.url))

export function selectProject(id) {
  const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
  return resolveProject(id ?? packageJson.config.project)
}
