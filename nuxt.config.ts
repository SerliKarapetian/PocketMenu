import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",

  devtools: { enabled: true },

  modules: [
    '@nuxt/icon',
    '@nuxtjs/google-fonts',
    '@nuxtjs/i18n',
    '@pinia/nuxt'
  ],

  pinia: {
    storesDirs: ['./stores']
  },

  i18n: {
    vueI18n: './i18n.config.ts',
    locales: [
      {
        code: 'fa',
        language: 'fa-IR',
        name: 'فارسی',
        dir: 'rtl',
        file: 'fa.json',
      },
      {
        code: 'en',
        language: 'en-US',
        name: 'English',
        dir: 'ltr',
        file: 'en.json',
      },
    ],
    defaultLocale: 'fa',
    strategy: 'prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      alwaysRedirect: false,
      fallbackLocale: 'fa',
    },
    langDir: 'locales',
    lazy: true,
  },

  css: ['./assets/css/main.css'],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  router: {
    middleware: ['i18n']
  },

  app: {
    head: {
      title: 'PocketMenu',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Never scan a restaurant QR code twice.'
        }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  }
})