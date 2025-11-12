import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ Relative base makes it work on any host (Netlify, GitHub Pages, etc.)
export default defineConfig({
  base: './',
  plugins: [react()],
})
