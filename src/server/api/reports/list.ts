export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { reports } = body

  const config = useRuntimeConfig()
  const { SURVEY_RESULTS_COLLECTION_NAME } = useAppConfig()
  const baseUrl = config.public.directus.url

  const validReports = await Promise.all(
    reports.map(async (report) => {
      const url = `${baseUrl}/items/${SURVEY_RESULTS_COLLECTION_NAME}/${report.id}`
      const response = await $fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.directusAccessToken}`,
        },
      })

      if (response.data) {
        return {
          id: response.data.id,
          date_created: response.data.date_created,
          survey_label: response.data.survey_label,
        }
      }
      return null
    }),
  )

  return validReports.filter(Boolean)
})
