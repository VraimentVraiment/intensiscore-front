<script setup lang="ts">
defineProps<{
  error: {
    statusCode: number
    message: string
  }
}>()

useHead({
  meta: [
    {
      name: 'robots',
      content: 'noindex',
    },
  ],
})
</script>

<template>
  <NuxtLayout>
    <AppSection>
      <template v-if="error.statusCode === 404">
        <h1 class="text-4xl">
          404 - Page non trouvée
        </h1>
        <p>
          La page que vous cherchez n'existe pas.
        </p>
        <p>
          Vous pouvez retourner à <PcoLink to="/">
            l'accueil
          </PcoLink>.
        </p>
        <p>
          Voici également un plan du site :
        </p>
        <AppSitemap />
      </template>
    </AppSection>
  </NuxtLayout>
</template>
