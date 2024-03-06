import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: 'https://miranda-wang1013.github.io/dream-interpreter/', 
  plugins: [react()],
})
