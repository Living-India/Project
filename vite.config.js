import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
  base: '/Sih/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), 'index.html'),
        login: resolve(process.cwd(), 'login.html'),
        profile: resolve(process.cwd(), 'profile.html'),
        auth: resolve(process.cwd(), 'auth.html'),
        auth2: resolve(process.cwd(), 'auth2.html'),
        auth3: resolve(process.cwd(), 'auth3.html')
      }
    }
  }
})
