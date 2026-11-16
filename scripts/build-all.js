import { buildProject } from './build.js'
import { projects } from '../config/projects.js'

for (const project of Object.keys(projects)) {
  console.log(`Building ${project}`)
  await buildProject(project)
}
