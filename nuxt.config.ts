// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@sfxcode/nuxt-primevue',
  ],
  css: [
    'primevue/resources/primevue.css',
    'primevue/resources/themes/viva-dark/theme.css',
    'primeicons/primeicons.css',
  ]
})
