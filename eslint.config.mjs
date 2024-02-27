import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt([
  {
    files: [
      'src/**/*.{spec,test}.{js,ts,jsx,tsx}',
    ],
    env: {
      jest: true,
    },
  },
])
