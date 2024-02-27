import { inject } from '@vercel/analytics'

export default defineNuxtPlugin(() => {
  const isDev = process.env.NODE_ENV === 'development'

  if (isDev) {
    return
  }
  inject()
})
