<script setup lang="ts">
const pages = await getSitemapPages()

const groups: Record<string, { loc: string, title: string | null, children: typeof pages }> = {}

pages
  .map((page) => {
    const parts = getUriPath(page.loc).split('/').filter(Boolean)
    return { page, parts }
  })
  .sort((a, b) => a.parts.length - b.parts.length) // make sure we process the deepest paths first
  .sort((a, b) => (a.parts[0] === 'fiches' ? 1 : 0) - (b.parts[0] === 'fiches' ? 1 : 0)) // make sure we process the fiches last
  .forEach(({ page, parts }) => {
    if (parts[0] === 'fiches') {
      const parentPath = parts[0]
      if (parts.length === 1) {
        groups[parentPath] = { ...page, children: [] }
      }
      else {
        groups[parentPath].children.push(page)
      }
    }
    else {
      groups[page.loc] = { ...page, children: [] }
    }
  })

const groupedPages = Object.values(groups)
</script>

<template>
  <ClientOnly>
    <ul role="list">
      <template
        v-for="item in groupedPages"
        :key="item.loc"
      >
        <li class="text-lg mb-4">
          <PcoLink :to="item.loc">
            {{ item.title || item.loc }}
          </PcoLink>
          <ul
            v-if="item.children && item.children.length > 0"
            class="ml-6 mt-2"
          >
            <li
              v-for="child in item.children"
              :key="child.loc"
              class="text-base mb-4"
            >
              <PcoLink :to="child.loc">
                {{ child.title || child.loc }}
              </PcoLink>
            </li>
          </ul>
        </li>
      </template>
    </ul>
  </ClientOnly>
</template>
