import webpack from 'webpack'
import createConfig from '../webpack.config.js'

export function buildProject(project) {
  return new Promise((resolve, reject) => {
    const compiler = webpack(createConfig({ project }, { mode: 'production' }))
    compiler.run((error, stats) => {
      compiler.close((closeError) => {
        if (stats) console.log(stats.toString({ colors: Boolean(process.stdout.isTTY), preset: 'minimal' }))
        if (error || closeError) return reject(error || closeError)
        if (stats.hasErrors()) return reject(new Error('Webpack build failed.'))
        resolve()
      })
    })
  })
}
