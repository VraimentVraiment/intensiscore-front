export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const {
    sort = null,
    reports = [],
    fields = ['*'],
    admin,
  } = body

  const config = useRuntimeConfig()
  const { SURVEY_RESULTS_COLLECTION_NAME } = useAppConfig()
  const baseUrl = config.public.directus.url
  const isAdmin = config.isAdmin

  if (reports.length === 0 && !isAdmin) {
    return {
      status: 400,
      body: {
        message: 'No reports provided',
      },
    }
  }

  const url = `${baseUrl}/items/${SURVEY_RESULTS_COLLECTION_NAME}`

  const urlParams = new URLSearchParams()
  urlParams.append('fields', fields.join(','))

  if (sort) {
    urlParams.append('sort', sort)
  }

  if (!admin || !isAdmin) {
    const filter = { id: { _in: reports.map(report => report.id) } }
    urlParams.append('filter', JSON.stringify(filter))
  }

  const response = await $fetch(`${url}?${urlParams.toString()}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.directusAccessToken}`,
    },
  })

  return response.data
})
