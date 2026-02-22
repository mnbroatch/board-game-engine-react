const path = require('path')

const modulesToTranspile = [
  'react-dialogue-tree'
]

module.exports = ({ config, mode }) => {
  config.resolve.alias['react-yarn-visual-novel'] = mode === 'PRODUCTION'
    ? path.resolve(__dirname, '../dist/react-yarn-visual-novel.min.js')
    : path.resolve(__dirname, '../src/index.js')

  // brittle
  const babelLoader = config.module.rules[config.module.rules.length - 1]
  babelLoader.exclude.shift()
  babelLoader.exclude.unshift(new RegExp(
    `node_modules\/(?!${modulesToTranspile.join('|')}).+`)
  )

  config.resolve.fallback = {
    fs: false,
    path: false,
  }
  return config
}
