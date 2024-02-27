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
}

async function useFetchDirectusPageItem({
  sheetId,
  status = ['published'],
  fields = ['*'],
}: {
  sheetId: string
  status: ('published' | 'private')[]
  fields?: string[]
}): Promise<ContentPage | null> {
  const { getItems } = useDirectusItems()

  try {
    const pages = await getItems<ContentPage>({
      collection: SHEETS_COLLECTION_NAME,
      params: {
        filter: {
          id: sheetId,
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
  sheetId,
  status: ['published'],
  fields: [
    'title',
    'content',
    'type',
    'description',
    'image.id',
    'image.description',
  ],
})

if (!pageContent) {
  navigateTo('/404')
}

if (pageContent?.title) {
  useHead({
    title: pageContent.title,
  })
}

// const baseUrl = 'https://admin.intensiscore.m2intenses.com'
const baseUrl = useRuntimeConfig().public.directus.url
</script>

<template>
  <div>
    <AppSection>
      <p class="pre-title color-gray-500 mb-0">
        {{ SHEET_TYPES[pageContent?.type as keyof typeof SHEET_TYPES] }}
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
      <p v-else>
        Cette fiche n'a pas enore de contenu.
      </p>
    </AppSection>
  </div>
</template>
