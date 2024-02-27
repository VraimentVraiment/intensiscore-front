export const getUsageCategory = <T extends WithUsageCategory> (usage: T): string | null => {
  return usage?.['building-usage__category'] ?? null
}

export const getUsageSubCategory = (usage: UsageIds): string | null => {
  return usage?.['building-usage__subCategory'] ?? null
}

export const getUsageUserLabel = (usage: UsageIds): string | null => {
  return usage?.['building-usage__userLabel'] ?? null
}

export const getCategoryColor = (value: string | null, { dark = false } = {}): string => {
  if (value === null) {
    return '#Dcc'
  }
  const category = CATEGORIES.find(el => el.value === value)
  return dark
    ? category?.colorDark ?? CATEGORICAL_COLORS.grey
    : category?.color ?? CATEGORICAL_COLORS.grey
}

export const getCategoryLabel = (value: string | null): string | null => {
  if (!value) {
    return null
  }
  const usageLabel = flatCategories
    .find(el => el.value === value)

  if (usageLabel?.text) {
    return usageLabel.text
  }

  return value
}

export const getCategoryType = (value: string): 'primary' | 'secondary' => {
  const category = CATEGORIES.find(el => el.value === value)
  return category?.type ?? 'secondary'
}

export const parentCategoriesChoices = DESTINATION_CATEGORIES
  .map((choice) => {
    const { text, value } = choice
    return {
      text: !choice.help ? text : `<span class="detailed-choice"><span class="choice__text">${text}</span><span class="choice__help">${choice.help}</span></span>`,
      value,
      test: 'A',
    }
  })

export const childCategoriesChoices = [
  ...DESTINATION_CATEGORIES
    .flatMap(({ children, value: parentValue }) => children
      .map(child => ({
        ...child,
        visibleIf: `{panel.building-usage__category} = '${parentValue}'`,
      })) || []),
  {
    ...UNKNOWN_SUBCATEGORY,
    visibleIf: `{panel.building-usage__category} != '${UNKNOWN_CATEGORY.value}'`,
  },
]
const UNKNOWN_CATEGORY_PREFIX = '?'
export const getParentCategoryPrefix = (value: string): string => {
  if (value === UNKNOWN_CATEGORY.value) {
    return UNKNOWN_CATEGORY_PREFIX
  }
  const index = DESTINATION_CATEGORIES.findIndex(el => el.value === value)
  return getAlphabetLetter(index).toUpperCase()
}

export const getChildCategoryPrefix = (value: string): string => {
  const parent = DESTINATION_CATEGORIES.find(el => el.children.some(child => child.value === value))

  if (!parent) {
    return UNKNOWN_CATEGORY_PREFIX
  }
  const parentLetter = getParentCategoryPrefix(parent?.value)
  const childIndex = parent?.children
    .findIndex(el => el.value === value)

  return `${parentLetter} | ${childIndex + 1}`
}

export const getCategorySchema = (category: ParentCategory | ChildCategory): {
  'building-usage__category': string
} => {
  return {
    'building-usage__category': category.value,
  }
}

export const getOfficeSubcategoryCondition = () => {
  return OFFICE_SUBCATEGORIES.map(subcategory => `{panel.building-usage__subCategory} = '${subcategory}'`).join(' or ')
}

export const getUsageId = <T extends WithUsageId>(usage?: T): string | null => {
  return usage?.['building-usage__id'] ?? null
}

export const getFullCategoryLabel = (usage: UsageIds): string => {
  // return getUsageUserLabel(usage) ?? getUsageSubCategory(usage) ?? getUsageCategory(usage)
  const categoryText = getCategoryLabel(getUsageCategory(usage))
  const subCategoryText = getCategoryLabel(getUsageSubCategory(usage))

  return [categoryText, subCategoryText]
    .filter(Boolean)
    .join(' : ')
}

export const getUsageKey = <T extends UsageIds>(usage: T): string => {
  return [
    getUsageCategory(usage),
    getUsageSubCategory(usage),
  ]
    .filter(Boolean)
    .join('-')
}

export const isStrictSameUsage = <T extends UsageIds>(usageA: T, usageB: T): boolean => {
  const usageKeyA = getUsageKey(usageA)
  const usageKeyB = getUsageKey(usageB)
  const usageIdA = getUsageId(usageA)
  const usageIdB = getUsageId(usageB)
  return (
    !!usageKeyA && !!usageKeyB
    && !!usageIdA && !!usageIdB
    && getUsageId(usageA) === getUsageId(usageB)
    && getUsageKey(usageA) === getUsageKey(usageB)
  )
}

export const isSameUsage = <T extends WithUsageId, U extends WithUsageId>(usageA: T, usageB: U): boolean => {
  const usageIdA = getUsageId(usageA)
  const usageIdB = getUsageId(usageB)
  return (
    !!usageIdA && !!usageIdB
    && getUsageId(usageA) === getUsageId(usageB)
  )
}

export const sortUsages = <T extends WithUsageId>(usageA: T, usageB: T): number => {
  const usageIdA = getUsageId(usageA)
  const usageIdB = getUsageId(usageB)
  if (!usageIdA || !usageIdB) {
    return 0
  }
  return usageIdA.localeCompare(usageIdB)
}

export const isSecondaryCategory = (value: string | null): boolean => {
  if (!value) {
    return false
  }
  return getCategoryType(value) === 'secondary'
}

export const isActuallySecondary = (usage) => {
  return ACTUALLYSECONDARY_CATEGORIES.some((category) => {
    return category.value === usage['building-usage__id']
  })
}

export const isSecondaryUsage = (usage: WithUsageId): boolean => {
  return ACTUALLYSECONDARY_CATEGORIES.some((category) => {
    return category.value === getUsageId(usage)
  })
}

export const isNullSpace = (usage: WithUsageId): boolean => {
  return NULL_CATEGORIES.some((category) => {
    return category.value === getUsageId(usage)
  })
}

export const hasFloorOnlySecondaryUsages = (floor: FloorWithUsages) => {
  return floor.usages.every((usage) => {
    return isActuallySecondary(usage)
  })
}

export const getMeanUsages = (usages: UsageIds[]): string[] => {
  const output = [] as string[]
  if (!usages?.length) {
    return output
  }

  const subCategories = usages
    .map(usage => getUsageSubCategory(usage))
    .filter(Boolean)

  if (subCategories.includes('craft-and-retail')) {
    const score = '3,2'
    output.push(`Un commerce type a un score d'environ ${score}`)
  }
  if (subCategories.includes('housing')) {
    const score = '4,2'
    output.push(`Un logement type a un score d'environ ${score}`)
  }

  if (
    subCategories.some((category) => {
      return OFFICE_SUBCATEGORIES.includes(category ?? '')
    })
  ) {
    const score = '3,1'
    output.push(`Un espace de bureaux type a un score d'environ ${score}`)
  }

  return output
}
