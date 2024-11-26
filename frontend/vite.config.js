import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // Adicione aqui outros aliases que você precisa
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    open: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})