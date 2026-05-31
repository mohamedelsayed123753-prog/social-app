import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'



// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), ],
})

"./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}"
