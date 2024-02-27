export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const { SURVEY_RESULTS_COLLECTION_NAME } = useAppConfig()
  const baseUrl = config.public.directus.url
  const reportId = event.context.params!.id
  const url = `${baseUrl}/items/${SURVEY_RESULTS_COLLECTION_NAME}/${reportId}`
  return proxyRequest(
    event,
    url,
    {
      headers: config.directusAccessToken
        ? {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.directusAccessToken}`,
          }
        : {},
    },
  )
})
