import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),],
  define: { 'process.env': {}, },
  server: {
    allowedHosts: ["http://f0s8848c8gkgoogo48co8ogk.167.114.30.219.sslip.io"]
  }
})
