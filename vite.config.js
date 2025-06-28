import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/HODLR/', // This should match your GitHub repository name
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})