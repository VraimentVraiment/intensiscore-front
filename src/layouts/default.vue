<script setup lang="ts">
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
