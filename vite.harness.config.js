import { resolve } from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: resolve(__dirname, 'test-app'),
  plugins: [react()],
  server: {
    port: 5174,
  },
  resolve: {
    alias: {
      'board-game-engine-react': resolve(__dirname, 'dist/board-game-engine-react.js'),
    },
  },
})
