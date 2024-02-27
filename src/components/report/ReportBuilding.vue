<script setup lang="ts">
const props = defineProps<{
  floorsScores: FloorScore[]
  floorsWithUsages: FloorWithUsages[]
  usagesScores: UsageScore[]
  usagesIds: UsageIds[]
  renderMode: SvgBuildingRenderMode
}>()

const {
  isTooltipVisible,
  tooltipContent,
  showTooltip,
  hideTooltip,
  setTooltipContent,
} = useBuildingInspectionTooltip(
  toRef(() => props.usagesScores),
  toRef(() => props.floorsScores),
)

const hasExceptions = props.floorsWithUsages.some((floor) => {
  return floor.usages.some((usage) => {
    return isSecondaryUsage(usage)
  })
})

const hasNullSpaces = props.floorsWithUsages.some((floor) => {
  return floor.usages.some((usage) => {
    return isNullSpace(usage)
  })
})

const exceptionLegend = {
  color: '#fff',
  label: 'Espace non pris en compte dans le calcul du score (parking, cave, etc.)',
}

const emptyLegend = {
  color: CATEGORICAL_COLORS.grey,
  label: 'Espace vacant, inconnu ou incertain (pris en compte dans le calcul du score)',
}

const usageLegendValues = computed(() => {
  const values = props.usagesScores.reduce((acc, usageScore) => {
    const usage = props.usagesIds.find(u => isSameUsage(u, usageScore))
    if (usage) {
      const color = getCategoryColor(getUsageCategory(usage), { dark: true })
      const label = getFullCategoryLabel(usage)
      if (!acc.some(v => v.color === color)) {
        acc.push({ color, label })
      }
    }
    return acc
  }, [] as { color: string, label: string }[])

  if (hasNullSpaces) {
    values.push(emptyLegend)
  }

  if (hasExceptions) {
    values.push(exceptionLegend)
  }

  return values
})
const svgcontainer = ref<HTMLElement | null>(null)
onMounted(() => {
  const svg = renderScore(scoreQuantizeColors, null, {
    vertical: true,
    swatchSize: 36,
    swatchAspectRatio: 0.5,
    paddingRight: 72,
    paddingLeft: 16,
    showEveryLabel: true,
    showScoreLabel: true,
    reverse: true,
    reverseAxis: true,
    labels: scoreInterpretationLabel,
  })
  if (svg && svgcontainer.value) {
    svgcontainer.value?.appendChild(svg)
  }
})
</script>

<template>
  <div
    :class="[
      'flex items-center align-center flex-row gap-12',
    ]"
  >
    <div class="flex-1 h-64 flex items-center justify-center">
      <SvgBuilding
        :floors-with-usages="floorsWithUsages"
        :usages-scores="usagesScores"
        :usages-ids="usagesIds"
        :render-mode="renderMode"
        :floors-scores="floorsScores"
        @usage-mouseover="($event) => {
          showTooltip()
          setTooltipContent($event)
        }"
        @usage-mouseout="() => hideTooltip()"
      />
      <PcoTooltip :visible="isTooltipVisible">
        <div
          v-if="tooltipContent.category"
        >
          <CategoryViewer
            size="sm"
            :category="tooltipContent.category"
            :category-text="tooltipContent.categoryText"
            :sub-category="tooltipContent.subCategory"
            :sub-category-text="tooltipContent.subCategoryText"
            :usage-user-label="tooltipContent.usageUserLabel"
            no-border
          />
          <div
            v-if="tooltipContent.score !== null"
            class="tooltip__score p-4 flex flex-col items-center"
          >
            <h3 class="text-sm text-center mb-1">
              Score pour cet usage&nbsp;:
            </h3>
            <ScoreViewer
              v-if="tooltipContent.score !== null"
              size="sm"
              :score="tooltipContent.score"
            />
          </div>
        </div>
        <div
          v-else-if="tooltipContent.floor !== null && tooltipContent.floor !== undefined"
          class="p4 flex flex-col items-center"
        >
          <template
            v-if="tooltipContent.score !== null"
          >
            <h3 class="text-sm text-center mb-1">
              Score pour le {{ getFloorLabel(tooltipContent.floor, tooltipContent.isRoof, { format: 'long' }).toLowerCase() }}
            </h3>
            <ScoreViewer
              size="sm"
              :score="tooltipContent.score"
            />
          </template>
          <template
            v-else
          >
            <h3 class="text-sm text-center mb-1">
              Aucun score pour le {{ getFloorLabel(tooltipContent.floor, tooltipContent.isRoof, { format: 'long' }).toLowerCase() }}
            </h3>
          </template>
        </div>
      </PcoTooltip>
    </div>
    <div class="flex-1 w-32 md:w-64 flex flex-col gap-4 justify-start">
      <div
        v-show="(
          renderMode !== 'usages'
        )"
        ref="svgcontainer"
      />
      <ColorScaleLegend
        v-if="renderMode === 'usages'"
        :values="usageLegendValues"
      />
      <div
        v-else-if="hasExceptions"
        class="pl-5"
      >
        <ColorScaleLegend
          :values="[exceptionLegend]"
        />
      </div>
    </div>
  </div>
</template>
