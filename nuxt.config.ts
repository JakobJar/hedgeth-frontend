// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [
    '~/assets/css/main.scss',
  ],
  runtimeConfig: {
    infura: {
      projectId: process.env.INFURA_PROJECT_ID,
      projectSecret: process.env.INFURA_PROJECT_SECRET,
    },
    public: {
      network: process.env.NETWORK ?? 'sepolia',
      fundFactoryAddress: process.env.FUND_FACTORY,
      usdcAddress: process.env.USDC_ADDRESS,
      smartRouterUrl: process.env.SMART_ROUTER_URL,
    }
  },
  vite: {
    vue: {
      script: {
        defineModel: true,
        propsDestructure: true,
      }
    }
  }
})
