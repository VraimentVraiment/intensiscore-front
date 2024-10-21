export default defineNuxtRouteMiddleware(() => {
  const config = useRuntimeConfig()
  if (import.meta.server && !config.isAdmin) {
    return navigateTo('/')
  }
})
