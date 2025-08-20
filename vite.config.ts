import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // 반드시 http 로! (https 금지)
      '/api': { target: 'http://localhost:8080', changeOrigin: true }
    }
  }
})