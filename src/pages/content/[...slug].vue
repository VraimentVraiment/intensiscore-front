<script setup lang="ts">
const route = useRoute()

const slug = route.params?.slug?.[0]
if (!slug) {
  navigateTo('/404')
}

const { PAGES_COLLECTION_NAME } = useAppConfig()

type ContentPage = {
  title: string
  content: string
}

/**
 * Right now we cannot use dompurify on the server.
 * When it is possible, we should use it to allow SSR generation of content hosted in Directus for better SEO.
 * @see https://github.com/LeSuisse/vue-dompurify-html/issues/1917
 */
const { data: pageContent, error } = await useAsyncData('page-content', async () => {
  const { getItems } = useDirectusItems()

  const pages = await getItems<ContentPage>({
    collection: PAGES_COLLECTION_NAME,
    params: {
      filter: {
        slug: slug as string,
        status: {
          _in: ['published'],
        },
      },
      fields: ['title', 'content'],
    },
  })
  return pages?.[0] ?? null
})

watch(error, () => {
  throw createError({
    statusCode: 404,
    message: 'Issue while fetching content',
  })
})

watchEffect(() => {
  if (!pageContent.value) {
    return
  }
  useHead({
    title: pageContent.value.title,
  })
})
</script>

<template>
  <div>
    <AppSection>
      <h1>
        {{ pageContent?.title }}
      </h1>
      <ClientOnly>
        <PcoContent
          v-if="pageContent?.content"
          :content="pageContent?.content"
        />
      </ClientOnly>
    </AppSection>
  </div>
</template>
