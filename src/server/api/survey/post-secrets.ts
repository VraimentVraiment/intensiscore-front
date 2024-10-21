export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const { SURVEY_RESULTS_SECRETS_COLLECTION_NAME } = useAppConfig()
  const baseUrl = config.public.directus.url
  const url = `${baseUrl}/items/${SURVEY_RESULTS_SECRETS_COLLECTION_NAME}`
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
