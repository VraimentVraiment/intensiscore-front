export async function getSitemapPages(): Promise<{
  loc: string
  title: string | null
}[]> {
  if (import.meta.server) {
    return []
  }

  const result = await fetch('/sitemap.xml')
  const xml = await result.text()

  const parser = new DOMParser()
  const doc = parser.parseFromString(xml, 'application/xml')
  const urls = doc.getElementsByTagName('url')

  const routes = useRouter().getRoutes()

  const pages = Array.from(urls)
    .map((url) => {
      const loc = url.getElementsByTagName('loc')?.[0]?.textContent

      if (!loc) {
        return null
      }
      let title: string | null = url.getElementsByTagName('title')?.[0]?.textContent ?? null

      if (title === null) {
        const slug = getUriPath(loc)
        const route = routes.find(route => route.path === slug)
        title = route?.meta?.title as string | null
      }

      return { loc, title }
    })
    .filter(Boolean) as { loc: string, title: string | null }[]

  return pages
}

export function getUriPath(uri: string) {
  const url = new URL(uri)
  return url.pathname
}

export function getSlug(str: string) {
  return str.split('/').pop()
}

export function getSlugFromUri(uri: string) {
  const url = new URL(uri)
  return getSlug(url.pathname)
}
