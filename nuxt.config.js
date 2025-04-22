export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@sidebase/nuxt-auth',
    '@nuxtjs/color-mode'
  ],
  auth: {
    origin: process.env.AUTH_ORIGIN || 'http://localhost:3000',
    enableGlobalAppMiddleware: true, // автоматически добавляет защиту к маршрутам
    configFile: 'auth.config.js'     // путь к конфигу
  },
  runtimeConfig: {
    authJs: {
      secret: process.env.AUTH_SECRET
    }
  },
  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: '',
    storageKey: 'hyboria-color-mode'
  },
  imports: {
    dirs: ['components'],
  },
  transpile: ['lucide-vue-next'],
  css: ['@/assets/css/tiptap.css']
})
