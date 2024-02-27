import type { AsyncData } from '#app'

const { SHEETS_COLLECTION_NAME } = useAppConfig()

export const useGetRelevantSheets = () => {
  const { getItems } = useDirectusItems()

  const getRelevantSheets = (
    result: SurveyResultModel,
    totalScore: number,
  ): AsyncData<SheetProps[], unknown> => {
    const slugs: string[] = getSheetSlugs(result, totalScore)
    const baseUrl = useRuntimeConfig().public.directus.url

    return useAsyncData('relevant-sheets', async () => {
      const items = await getItems<CmsSheet>({
        collection: SHEETS_COLLECTION_NAME,
        params: {
          filter: {
            slug: {
              _in: slugs,
            },
            status: {
              _in: ['published'],
            },
          },
          fields: ['*', 'tags.intensiscore__tags_id.name'],
        },
      })
      return items?.map(e => getCardProps(e, baseUrl)) ?? []
    })
  }

  return {
    getRelevantSheets,
  }
}
