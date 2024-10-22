<script setup lang="ts">
const route = useRoute()

const sheetId = route.params.id as string
if (!sheetId) {
  navigateTo('/404')
}

const { SHEETS_COLLECTION_NAME } = useAppConfig()

const SHEET_TYPES = {
  'methodology': 'Fiche méthodologique',
  'use-case': 'Fiche cas d\'usage',
  'typical_space': 'Fiche espace type',
}

type ContentPage = {
  title: string
  description: string
  content: string
  type: keyof typeof SHEET_TYPES
  image: {
    id: string
    description: string
  }
}

const { data: pageContent, error } = await useAsyncData('page-content', async () => {
  const { getItems } = useDirectusItems()

  const pages = await getItems<ContentPage>({
    collection: SHEETS_COLLECTION_NAME,
    params: {
      filter: {
        id: sheetId,
        status: {
          _in: ['published'],
        },
      },
      fields: [
        'title',
        'content',
        'type',
        'description',
        'image.id',
        'image.description',
      ],
    },
  })
  return pages?.[0] ?? null
}, { server: false })

const type = computed(() => {
  return SHEET_TYPES[pageContent?.value?.type as keyof typeof SHEET_TYPES]
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

const baseUrl = useRuntimeConfig().public.directus.url
</script>

<template>
  <div>
    <AppSection>
      <p class="pre-title color-gray-500 mb-0">
        {{ type }}
      </p>
      <h1 class="mt-2">
        {{ pageContent?.title }}
      </h1>
      <div
        v-if="pageContent?.description"
        class="mb-12"
      >
        <p class="text-lg">
          {{ pageContent?.description }}
        </p>
      </div>
      <div
        v-if="pageContent?.image?.id"
        class="mb-12"
      >
        <NuxtPicture
          :src="baseUrl + '/assets/' + pageContent?.image.id"
          alt="Image de la fiche"
          class="object-cover w-full h-full h-24 lg:h-32"
        />
        <p
          v-if="pageContent?.image.description"
          class="text-sm color-gray-500 mt-2"
        >
          {{ pageContent?.image.description }}
        </p>
      </div>
      <PcoContent
        v-if="pageContent?.content"
        :content="pageContent?.content"
      />
    </AppSection>
  </div>
</template>
