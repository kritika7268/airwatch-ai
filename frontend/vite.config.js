import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      },
      '/dashboard': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      },
      '/hotspots': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      },
      '/predict': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      },
      '/report': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      },
      '/alerts': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      },
      '/alert': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      },
      '/config': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      }
    }
  }
})
