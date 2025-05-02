import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Allows external access
    port: 5173,       // Ensure this port is open
    allowedHosts: ['gautamfamily.org.np',
      "http://54.173.191.197",],
    hmr: {
      protocol: 'wss',
      host: 'gautamfamily.org.np',
    },
  },
})
