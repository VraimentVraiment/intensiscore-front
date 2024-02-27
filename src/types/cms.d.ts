declare global {

  type TagProps = {
    name: string
    isClickable?: boolean
    isActive?: boolean
    size?: 'sm' | 'md' | 'lg'
  }

  type SheetProps = {
    title: string
    description: string
    id: string
    tags?: string[]
    actionText?: string
    actionIcon?: string
    href?: string
    image?: string
  }

  type CmsSheet = {
    title: string
    description: string
    tags: {
      intensiscore__tags_id: {
        name: string
      }
    }[]
    id: number
  }

  type CmsSurveyRecord = SurveyRecord & {
    id: string
    date_created: string
  }
}

export {}
