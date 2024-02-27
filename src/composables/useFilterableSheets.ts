export function useFilterableSheets() {
  const { getItems } = useDirectusItems()
  const baseUrl = useRuntimeConfig().public.directus.url

  const { SHEETS_COLLECTION_NAME } = useAppConfig()

  const fetchTypes = async (): Promise<{ name: string, label: string }[]> => { /** @todo: fetch from directus API */
    return [
      {
        key: 'methodology',
        name: 'Méthodologie',
      },
      {
        key: 'typical_space',
        name: 'Espace type',
      },
      {
        key: 'use-case',
        name: 'Cas d\'usage',
      },
    ]
  }

  const fetchTags = async () => {
    const keywordsItems = await getItems<{
      name: string
    }>({
      collection: 'intensiscore__tags',
      params: {
        fields: ['*'],
        filter: {
          status: {
            _in: ['published'],
          },
          is_filter: {
            _eq: true,
          },
        },
      },
    })

    const typeItems = await fetchTypes()

    return {
      keywords: keywordsItems?.map((tag: { name: string }) => ({
        name: tag.name,
        isClickable: true,
        isActive: false,
        size: 'sm',
      })),
      types: typeItems.map((type: { name: string }) => ({
        name: type.name,
        key: type.key,
        isClickable: true,
        isActive: false,
        size: 'sm',
      })),
    }
  }

  const getTagsFilter = (keywords: string[], types: string[]) => {
    const filter = {}
    if (!keywords && !types) {
      return filter
    }
    filter._and = []
    if (keywords?.length) {
      filter._and.push({
        tags: {
          _or: keywords?.map(name => ({
            intensiscore__tags_id: {
              name: {
                _eq: name,
              },
            },
          })) ?? [],
        },
      })
    }
    if (types?.length) {
      filter._and.push({
        type: {
          _in: types,
        },
      })
    }
    return filter
  }

  const resetFilters = () => {
    tags.value?.keywords?.forEach((tag) => {
      tag.isActive = false
    })
    tags.value?.types?.forEach((tag) => {
      tag.isActive = false
    })
  }

  const fetchPages = async () => {
    const activeKeywords = tags.value?.keywords
      ?.filter(tag => tag.isActive)
      .map(tag => tag.name) ?? null

    const activeTypes = tags.value?.types
      ?.filter(tag => tag.isActive)
      .map(tag => tag.key) ?? null

    const filter = getTagsFilter(activeKeywords, activeTypes)

    const items = await getItems<CmsSheet>({
      collection: SHEETS_COLLECTION_NAME,
      params: {
        filter: {
          ...filter,
          status: {
            _in: ['published'],
          },
        },
        fields: ['*', 'tags.intensiscore__tags_id.name'],
      },
    })
    return items.map(e => getCardProps(e, baseUrl))
  }

  const {
    data: tags,
    pending: tagsPending,
    error: tagsError,
  } = useAsyncData<TagProps[]>('sheets-tags', fetchTags)

  const {
    data: pages,
    pending: pagesPending,
    error: pagesError,
    refresh: refreshPages,
  } = useAsyncData<SheetProps[]>('sheets-pages', fetchPages)

  watch(() => tags.value, () => {
    refreshPages()
  }, { deep: true })

  return {
    tags,
    fetchTypes,
    tagsPending,
    tagsError,
    pages,
    resetFilters,
    pagesPending,
    pagesError,
  }
}
