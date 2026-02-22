module.exports = {
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest'
  },
  testEnvironment: 'jsdom',
  transformIgnorePatterns: [
    '/node_modules/(?!yarn-bound|@mnbroatch|react-dialogue-tree).+\\.js$'
  ],
  moduleNameMapper: {
    '^.+\\.(css|less|scss)$': 'babel-jest'
  },
  clearMocks: true
}
