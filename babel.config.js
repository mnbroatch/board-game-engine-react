const coverage = process.env.COVERAGE === '1'

module.exports = {
  presets: [
    '@babel/preset-react',
    ['@babel/preset-env', { targets: { node: 'current' } }]
  ],
  plugins: [
    '@babel/plugin-proposal-object-rest-spread',
    ...(coverage
      ? [['istanbul', { include: ['src/**/*.js'], exclude: ['**/*.spec.js', '**/node_modules/**', 'e2e/**'] }]]
      : [])
  ]
}
