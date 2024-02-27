export const getCardProps = (page: CmsSheet, baseUrl: string): SheetProps => {
  return {
    type: page.type,
    title: page.title,
    description: page.description,
    tags: page.tags?.map(t => t.intensiscore__tags_id?.name).filter(Boolean) ?? [],
    id: page.id.toString(),
    image: baseUrl + '/assets/' + page.image,
    href: `/fiches/${page.id}`,
  }
}
