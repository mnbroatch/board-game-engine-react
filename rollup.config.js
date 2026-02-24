import babel from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'
import scss from 'rollup-plugin-scss'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

const config = [
  {
    input: 'src/index.js',
    external: ['react'],
    output: {
      format: 'umd',
      file: 'dist/board-game-engine-react.js',
      name: 'BoardGameEngineReact'
    },
    plugins: [
      resolve(),
      commonjs({ include: /node_modules/ }),
      babel(),
      scss()
    ]
  },
  {
    input: 'src/index.js',
    external: ['react'],
    output: {
      format: 'umd',
      file: 'dist/board-game-engine-react.min.js',
      name: 'BoardGameEngineReact'
    },
    plugins: [
      resolve(),
      commonjs({ include: /node_modules/ }),
      babel(),
      scss({ outputStyle: 'compressed' }),
      terser()

    ]
  }
]

export default config
