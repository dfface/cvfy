import { defineNuxtConfig } from 'nuxt/config'
import en from './i18n/locales/en.json'

/**
 * Every locale gets a pre-rendered page so a static host (GitHub Pages) can
 * serve /<locale>/create directly instead of returning a 404.
 */
const LOCALE_CODES = ['en', 'es', 'id', 'de', 'fr', 'ar', 'zh', 'pt', 'az', 'nl']

export default defineNuxtConfig({
  devtools: { enabled: false },

  site: {
    url:
      // eslint-disable-next-line node/prefer-global/process
      process.env.NUXT_SITE_URL
      // eslint-disable-next-line node/prefer-global/process
      || (process.env.NODE_ENV === 'dev'
        ? 'http://localhost:3000'
        : 'https://www.cvfy.xyz'),
  },

  imports: {
    autoImport: true,
  },

  app: {
    // Set through NUXT_APP_BASE_URL when deploying to a sub path (e.g. GitHub
    // Pages serves from /<repo>/). Defaults to the domain root.
    baseURL:
      // eslint-disable-next-line node/prefer-global/process
      process.env.NUXT_APP_BASE_URL || '/',

    // Global page headers (https://go.nuxtjs.dev/config-head)
    head: {
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'google-site-verification',
          content: 'CGbgWpLEg4fyBPWujKEYS3rrwZR4mMU7XfsDEGArchg',
        },
      ],
    },
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: ['@/assets/styles/styles.css'],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/i18n',
    '@nuxtjs/sitemap',
    '@nuxtjs/tailwindcss',
    '@vite-pwa/nuxt',
    '@nuxt/fonts',
    '@nuxt/image',
  ],

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {},

  // Static generation (https://go.nuxtjs.dev/config-nitro)
  nitro: {
    prerender: {
      routes: ['/create', ...LOCALE_CODES.map(code => `/${code}/create`)],
    },
  },

  postcss: {
    // Add plugin names as key and arguments as value
    // Install them before as dependencies with npm or yarn
    plugins: {
      'postcss-nested': {},
    },
  },

  fonts: {
    defaults: {
      weights: [300, 400, 700],
    },
    // Chinese webfonts, self-hosted at build time. They are much heavier than
    // the Latin system stacks above (several MB per family), so only add
    // families that are actually offered in the font picker.
    families: [
      { name: 'Noto Sans SC', weights: [400, 700] },
      { name: 'Noto Serif SC', weights: [400, 700] },
      { name: 'ZCOOL XiaoWei', weights: [400] },
    ],
  },

  i18n: {
    vueI18n: './i18n.config.ts',
    bundle: {
      optimizeTranslationDirective: false,
    },
    strategy: 'prefix_and_default',
    locales: [
      {
        code: 'en',
        file: 'en.json',
        name: 'English',
      },
      {
        code: 'es',
        file: 'es.json',
        name: 'Español',
      },
      {
        code: 'id',
        file: 'id.json',
        name: 'Indonesian',
      },
      {
        code: 'de',
        file: 'de.json',
        name: 'German',
      },
      {
        code: 'fr',
        file: 'fr.json',
        name: 'Francais',
      },
      {
        code: 'ar',
        file: 'ar.json',
        name: 'Arabic',
      },
      {
        code: 'zh',
        file: 'zh.json',
        name: 'Chinese',
      },
      {
        code: 'pt',
        file: 'pt.json',
        name: 'Portuguese',
      },
      {
        code: 'az',
        file: 'az.json',
        name: 'Azerbaijani',
      },
      {
        code: 'nl',
        file: 'nl.json',
        name: 'Nederlands',
      },
    ],
    lazy: false,
    defaultLocale: 'en',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
    },
  },

  router: {
    options: {
      linkActiveClass: 'form__btn--active',
    },
  },

  pwa: {
    devOptions: {
      enabled: false,
    },
    registerType: 'autoUpdate',
    // PWA icon generation runs sharp. Set GENERATE_SKIP_PWA_ASSETS=true to skip
    // it (e.g. as a CI workaround) if the sharp build ever crashes again.
    pwaAssets: process.env.GENERATE_SKIP_PWA_ASSETS ? false : {
      config: true,
    },
    manifest: {
      name: 'Cvfy',
      short_name: 'CvFy',
      lang: 'en',
      scope: '/',
      display: 'standalone',
      start_url: '/create',
      description: en.description,
      theme_color: '#f3f4f6',
    },
    workbox: {
      cleanupOutdatedCaches: true,
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
    },
    client: {
      installPrompt: true,
      periodicSyncForUpdates: 3600,
    },
  },

  sitemap: {
    autoI18n: true,
  },

  compatibilityDate: '2025-06-12',
})
