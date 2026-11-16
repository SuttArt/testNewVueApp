import { existsSync } from 'node:fs'
import { createServer } from 'node:http'
import path from 'node:path'
import { parseArgs } from 'node:util'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import sirv from 'sirv'
import createConfig from '../webpack.config.js'
import { rootDirectory, selectProject } from '../config/selection.js'
import { buildProject } from './build.js'

try {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: { project: { type: 'string' }, host: { type: 'string' }, port: { type: 'string' } },
  })
  const [command] = positionals
  if (positionals.length !== 1 || !['dev', 'build', 'preview'].includes(command)) {
    throw new Error('Expected dev, build, or preview with optional --project PROJECT_ID, --host HOST, --port PORT.')
  }
  const project = selectProject(values.project)
  const port = Number(values.port ?? (command === 'preview' ? 4173 : 5173))
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Port must be an integer from 1 to 65535.')
  const host = values.host ?? '127.0.0.1'

  if (command === 'build') {
    await buildProject(project.config.id)
  } else if (command === 'dev') {
    const config = createConfig({ project: project.config.id }, { mode: 'development' })
    const server = new WebpackDevServer({ ...config.devServer, host, port }, webpack(config))
    await server.start()
  } else {
    const directory = path.join(rootDirectory, 'dist', project.config.id)
    if (!existsSync(path.join(directory, 'index.html'))) {
      throw new Error(`No build for ${project.config.id}. Run npm run build -- --project ${project.config.id} first.`)
    }
    const assets = sirv(directory, { dev: true })
    const server = createServer((request, response) => {
      assets(request, response, () => {
        response.writeHead(404, { 'Content-Type': 'text/plain' })
        response.end('Not found')
      })
    })
    server.on('error', (error) => { console.error(error.message); process.exitCode = 1 })
    server.listen(port, host, () => console.log(`Preview ${project.config.id}: http://${host}:${port}`))
  }
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
