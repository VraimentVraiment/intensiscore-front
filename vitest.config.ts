import path from 'path'
import { defineVitestConfig } from '@nuxt/test-utils/config'
import AutoImport from 'unplugin-auto-import/vite'

export default defineVitestConfig({

  test: {
    root: '.',
  },

  plugins: [
    AutoImport({
      imports: [
        'vitest',
      ],
      dts: './tests-auto-imports.d.ts',
    }),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '~': path.resolve(__dirname, './src'),
      '#imports': path.resolve(__dirname, './.nuxt/imports.d.ts'),
      '#components': path.resolve(__dirname, './.nuxt/components.d.ts'),
    },
  },
})
