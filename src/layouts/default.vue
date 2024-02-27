<script setup lang="ts">
const {
  siteTitle,
  siteLogo,
  titleSeparator,
} = useAppConfig()

useHead({
  titleTemplate: (pageTitle) => {
    return [
      pageTitle,
      siteTitle,
    ]
      .filter(Boolean)
      .join(` ${titleSeparator} `)
  },
  link: [
    { rel: 'icon', type: 'image/x-icon', href: siteLogo.src },
  ],
})
</script>

<template>
  <Html lang="fr">
    <AppHeader
      id="site-header"
    />
    <AppMain id="site-main">
      <slot />
    </AppMain>
    <AppFooter id="site-footer" />
  </Html>
</template>

<style scoped lang="scss">
#site-main {
  min-height: 100vh;
}
</style>
