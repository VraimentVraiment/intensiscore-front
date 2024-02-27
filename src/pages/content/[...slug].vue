<script setup lang="ts">
const route = useRoute()

const slug = route.params?.slug?.[0]
if (!slug) {
  navigateTo('/404')
}

type PageItemQueryParams = {
  pageName: string
  status: ('published' | 'private')[]
  fields?: string[]
}

const { PAGES_COLLECTION_NAME } = useAppConfig()

type DirectusBlock = {
  id: string
  type: string
  data: unknown
}
type ContentPage = {
  title: string
  content: DirectusBlock[]
}
async function useFetchDirectusPageItem({
  pageName,
  status = ['published'],
  fields = ['*'],
}: PageItemQueryParams): Promise<ContentPage | null> {
  const { getItems } = useDirectusItems()

  try {
    const pages = await getItems<ContentPage>({
      collection: PAGES_COLLECTION_NAME,
      params: {
        filter: {
          slug: pageName,
          status: {
            _in: status,
          },
        },
        fields,
      },
    })
    return pages?.[0] ?? null
  }
  catch (error) {
    return null
  }
}

const pageContent = await useFetchDirectusPageItem({
  pageName: slug as string,
  status: ['published'],
  fields: ['title', 'content'],
})

if (!pageContent) {
  navigateTo('/404')
}

if (pageContent?.title) {
  useHead({
    title: pageContent.title,
  })
}
</script>

<template>
  <div>
    <AppSection>
      <h1>
        {{ pageContent?.title }}
      </h1>
      <PcoContent
        v-if="pageContent?.content"
        :content="pageContent?.content"
      />
    </AppSection>
  </div>
</template>
