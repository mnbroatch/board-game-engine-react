import * as esbuild from 'esbuild'

const entry = 'src/index.js'
const outdir = 'dist'
const coverage = process.env.COVERAGE === '1'

const base = {
  entryPoints: [entry],
  bundle: true,
  platform: 'browser',
  target: ['es2020'],
  jsx: 'automatic',
  loader: { '.js': 'jsx' },
  external: ['react', 'react-dom', 'board-game-engine'],
}

if (coverage) {
  const { esbuildPluginIstanbul } = await import('esbuild-plugin-istanbul')
  await esbuild.build({
    ...base,
    outfile: `${outdir}/board-game-engine-react.mjs`,
    format: 'esm',
    minify: false,
    plugins: [
      esbuildPluginIstanbul({
        name: 'istanbul',
        filter: /\.(js|ts|jsx|tsx)$/,
        include: ['src/**/*.js'],
        exclude: ['**/*.spec.js', '**/node_modules/**'],
      }),
    ],
  })
  console.log('Built instrumented bundle:', `${outdir}/board-game-engine-react.mjs`)
  process.exit(0)
}

await Promise.all([
  esbuild.build({ ...base, outfile: `${outdir}/board-game-engine-react.cjs`, format: 'cjs' }),
  esbuild.build({ ...base, outfile: `${outdir}/board-game-engine-react.mjs`, format: 'esm' }),
])

console.log('Built:', `${outdir}/board-game-engine-react.cjs`, `${outdir}/board-game-engine-react.mjs`)
