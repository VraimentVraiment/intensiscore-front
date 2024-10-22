/**
 * @see https://nuxt.com/docs/api/configuration/nuxt-config
 */

import { fileURLToPath } from 'url'

export default defineNuxtConfig({
  srcDir: 'src/',

  devtools: {
    enabled: true,
  },

  modules: [
    'nuxt-directus',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt',
    '@unocss/nuxt',
    '@nuxt/eslint',
    '@nuxtjs/stylelint-module',
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxtjs/seo',
    'nuxt-link-checker',
    'nuxt-seo-experiments',
    'nuxt-security',
  ],

  security: {
    headers: {
      contentSecurityPolicy: {
        'img-src': [
          '\'self\'',
          'data:',
          process.env.NUXT_PUBLIC_DIRECTUS_URL,
        ],
        'upgrade-insecure-requests': process.env.NODE_ENV !== 'development',
      },
    },
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },

  css: [
    '@/styles/main.scss',
  ],

  vite: {
    vue: {
      script: {
        globalTypeFiles: [
          fileURLToPath(new URL('./src/types/cms.d.ts', import.meta.url)),
          fileURLToPath(new URL('./src/types/app.d.ts', import.meta.url)),
          fileURLToPath(new URL('./src/types/survey.d.ts', import.meta.url)),
        ],
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          additionalData: '@use "@/styles/abstracts/" as *;',
        },
      },
    },
  },

  site: {
    url: 'https://intensiscore.m2intenses.com',
    name: 'Intensi\'Score',
    description: 'Diagnostiquer l\'intensité d\'usage des bâtiments avec l\'Intensi\'Score',
    defaultLocale: 'fr',
  },

  sitemap: {
    exclude: [
      '/admin/**',
      '/diagnostic-approfondi',
    ],
    sources: [
      '/api/__sitemap__/urls',
    ],
  },

  piniaPersistedstate: {
    storage: 'localStorage',
  },

  runtimeConfig: {
    directusAccessToken: 'my-secret-key',
    isAdmin: false,
    public: {
      directus: {
        url: 'http://0.0.0.0:8055',
        autoFetch: false,
        devtools: true,
      },
    },
  },

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  imports: {
    dirs: [
      'composables/**',
      'stores/**',
      'utils/**',
      'config/**',
    ],
  },

  ignore: [
    '**/*.test.*',
    '**/*.spec.*',
    '**/*.cy.*',
  ],

  compatibilityDate: '2024-10-09',
})
