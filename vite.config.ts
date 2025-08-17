import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Replace <repo> with your repo name
export default defineConfig({
  plugins: [react()],
  base: '/DontBeAHypocrite/',
})



