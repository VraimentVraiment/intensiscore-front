export default defineSitemapEventHandler(async () => {
  try {
    const config = useRuntimeConfig()
    const { PAGES_COLLECTION_NAME, SHEETS_COLLECTION_NAME } = useAppConfig()
    const baseUrl = config.public.directus.url

    const fetchPages = async <T extends { [key: string]: string }>(collectionName: string, fields: string[]) => {
      const url = `${baseUrl}/items/${collectionName}`
      const response = await $fetch<{ data: T[] }>(url, {
        headers: config.directusAccessToken
          ? {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${config.directusAccessToken}`,
            }
          : {},
        params: {
          fields: fields,
          filter: JSON.stringify({
            status: {
              _eq: 'published',
            },
          }),
        },
      })

      if (!response.data) {
        throw createError({
          statusCode: 500,
          statusMessage: `Failed to fetch pages from Directus collection: ${collectionName}`,
        })
      }

      return response.data
    }

    const [pagesSlugs, sheetsSlugs] = await Promise.all([
      fetchPages<{ slug: string, title: string }>(PAGES_COLLECTION_NAME, ['slug', 'title']),
      fetchPages<{ id: string, title: string }>(SHEETS_COLLECTION_NAME, ['id', 'title']),
    ])

    const pagesUrls = pagesSlugs.map((page: { slug: string, title: string }) => ({
      loc: `/content/${page.slug}`,
      title: page.title,
      // lastmod: new Date().toISOString(),
    }))

    const sheetsUrls = sheetsSlugs.map((sheet: { id: string, title: string }) => ({
      loc: `/fiches/${sheet.id}`,
      // title: sheet.title,
      // lastmod: new Date().toISOString(),
    }))

    return [...pagesUrls, ...sheetsUrls]
  }
  catch (error) {
    console.error(error)
    return []
  }
})
