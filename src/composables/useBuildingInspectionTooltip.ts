export const useBuildingInspectionTooltip = (
  usagesScores: Ref<UsageScore[]>,
  floorsScores: Ref<FloorScore[]>,
) => {
  const isTooltipVisible = ref(false)
  const tooltipContent = ref<{
    category: string
    categoryText: string
    subCategory: string | null
    subCategoryText: string | null
    score: number | null
    usageUserLabel: string
  } | {
    floor: number
    isRoof: boolean
    score: number | null
  }
  >({
    category: '',
    categoryText: '',
    subCategory: null,
    subCategoryText: null,
    score: null,
    usageUserLabel: '',
  })

  const showTooltip = () => {
    isTooltipVisible.value = true
  }

  const hideTooltip = () => {
    isTooltipVisible.value = false
  }

  const setTooltipContent = (event: UsageIds | FloorWithUsages) => {
    if ((event as UsageIds)['building-usage__id']) {
      const category = getUsageCategory(event as UsageIds) as string
      const categoryText = getCategoryLabel(category) as string
      const subCategory = getUsageSubCategory(event as UsageIds)
      const subCategoryText = getCategoryLabel(subCategory)
      const score = isNullSpace(event as UsageIds)
        ? 0
        : usagesScores.value?.find(u => isSameUsage(u, event as UsageIds))?.score ?? null
      const usageUserLabel = getUsageUserLabel(event as UsageIds) ?? ''

      tooltipContent.value = {
        category,
        categoryText,
        subCategory,
        subCategoryText,
        score,
        usageUserLabel,
      }
    }
    else if (hasFloorOnlySecondaryUsages(event as FloorWithUsages)) {
      tooltipContent.value = {
        score: null,
        floor: Number((event as FloorWithUsages).id),
        isRoof: (event as FloorWithUsages).isRoof,
      }
    }
    else {
      const score = floorsScores.value?.find(f => f.id === (event as FloorWithUsages).id)?.score ?? null
      tooltipContent.value = {
        score,
        floor: Number((event as FloorWithUsages).id),
        isRoof: (event as FloorWithUsages).isRoof,
      }
    }
  }

  return {
    isTooltipVisible,
    tooltipContent,
    showTooltip,
    hideTooltip,
    setTooltipContent,
  }
}
