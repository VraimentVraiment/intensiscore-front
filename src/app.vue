<script setup lang="ts">
const {
  siteTitle,
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
  meta: [
    {
      name: 'google-site-verification',
      content: 'aQGrgOfwOtCy5IiKcgYzEv8kChIC-r4mordTsbAiDbo',
    },

  ],
  link: [
    /**
     * Nuxt seo plugin should automatically add the favicon tags to the head, but if it doesn't...
     * @see https://nuxtseo.com/experiments/guides/app-icons#icon
     */
    {
      rel: 'icon',
      href: '/favicon.ico',
      sizes: 'any',
    },
  ],
})
defineOgImage({
  url: '/img/intensiscore-metaimg_og.png',
  width: 1200,
  height: 630,
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
