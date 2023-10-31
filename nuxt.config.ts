// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@sfxcode/nuxt-primevue'
  ],
  css: [
    'primevue/resources/primevue.css',
    'primevue/resources/themes/viva-dark/theme.css',
    'primeicons/primeicons.css',
  ],
  runtimeConfig: {
    infura: {
      projectId: process.env.INFURA_PROJECT_ID,
      projectSecret: process.env.INFURA_PROJECT_SECRET,
    },
    public: {
      network: process.env.NETWORK ?? 'sepolia',
      fundFactoryAddress: process.env.FUND_FACTORY,
      usdcAddress: process.env.USDC_ADDRESS
    }
  }
})
