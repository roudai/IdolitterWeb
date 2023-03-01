import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'

export default defineNuxtConfig({
  routeRules: {
    '/idol': { ssr: false },
    '/group': { ssr: false },
    '/ranking': { ssr: false },
    '/history': { ssr: false },
  },

  // https://v3.nuxtjs.org/api/configuration/nuxt.config#typescript
  typescript: {
    shim: false,
    strict: true,
  },

  // https://v3.nuxtjs.org/api/configuration/nuxt.config#app
  app: {
    head: {
      title: 'アイドリッター',
      titleTemplate: '%s - 日本最大の現役アイドル情報データベース',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content: 'アイドリッターは、日本最大の現役アイドル情報データベースです。',
        },
      ],
      link: [
        {
          hid: 'apple-touch-icon',
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/apple-touch-icon.png',
        },
        {
          hid: 'icon32',
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/favicon-32x32.png',
        },
        {
          hid: 'icon16',
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: '/favicon-16x16.png',
        },
        { hid: 'manifest', rel: 'manifest', href: '/site.webmanifest' },
        {
          hid: 'mask-icon',
          rel: 'mask-icon',
          href: '/safari-pinned-tab.svg',
          color: '#5bbad5',
        },
      ],
    },
  },

  // https://v3.nuxtjs.org/api/configuration/nuxt.config#css
  css: ['@/assets/primer.scss'],

  // https://v3.nuxtjs.org/api/configuration/nuxt.config#components
  components: true,

  // build modules
  modules: ['@pinia/nuxt', '@vueuse/nuxt', 'unplugin-icons/nuxt', 'nuxt-lodash'],

  // vueuse
  // vueuse: {
  //   ssrHandlers: true,
  // },

  // vite
  vite: {
    // unplugin-icons
    // https://github.com/antfu/unplugin-icons
    plugins: [
      Components({
        resolvers: [IconsResolver()],
      }),
      Icons({ compiler: 'vue3' }),
    ],
  },

  runtimeConfig: {
    public: {
      baseURL: process.env.baseURL || '',
      apiKey: process.env.apiKey || '',
      FB_API_KEY: process.env.FB_API_KEY || '',
      FB_AUTH_DOMAIN: process.env.FB_AUTH_DOMAIN || '',
      FB_PROJECT_ID: process.env.FB_PROJECT_ID || '',
      FB_STORAGE_BUCKET: process.env.FB_STORAGE_BUCKET || '',
      FB_MESSAGING_SENDER_ID: process.env.FB_MESSAGING_SENDER_ID || '',
      FB_APP_ID: process.env.FB_APP_ID || '',
      FB_MEASUREMENT_ID: process.env.FB_MEASUREMENT_ID || '',
    },
  },
})
