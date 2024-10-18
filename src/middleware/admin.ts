export default defineNuxtRouteMiddleware(() => {
  const config = useRuntimeConfig()
  if (!config.isAdmin) {
    return navigateTo('/')
  }
})
