<script lang="ts">
import { RendererFactory, Question } from 'survey-core'

const CUSTOM_TYPE = 'custom-building-matrix'

RendererFactory.Instance.registerRenderer(
  'text',
  'custom-building-matrix',
  'custom-building-matrix',
)

export class QuestionCustomBuildingMatrix extends Question {
  getType() {
    return CUSTOM_TYPE
  }
}
</script>

<script setup lang="ts">
const props = defineProps<{
  question: QuestionCustomBuildingMatrix
}>()

defineOptions({
  inheritAttrs: false,
})

const survey = props.question.survey

const hasBasement = survey.getQuestionByName('building-hasBasement')?.value === 'yes'

const destinationsUsages = survey.getQuestionByName('building-mainUsages')?.value as UsageIds[] || []
const secondaryUsages = parseSecondaryUsages(survey)
const selectableUsages = [
  ...destinationsUsages,
  ...secondaryUsages,
]
  .filter(Boolean)
  .map((u) => {
    const category = getUsageCategory(u)
    const subCategory = getUsageSubCategory(u)
    const categoryType = getCategoryType(category)
    const categoryText = getCategoryLabel(category) as string
    const subCategoryText = getCategoryLabel(subCategory)
    const usageUserLabel = getUsageUserLabel(u)
    return {
      usage: u,
      category,
      categoryText,
      subCategory,
      subCategoryText,
      categoryType,
      usageUserLabel,
    }
  })

const surveyValues: BuildingDescription = {
  nFloors: survey.getQuestionByName('building-nFloors')?.value as number || 1,
  nBasementsLevels: hasBasement ? survey.getQuestionByName('building-nBasementsLevels')?.value as number || 0 : 0,
  hasFlatRoof: survey.getQuestionByName('building-hasFlatRoof')?.value === 'yes',
}

const doGetInitialRepartition = (): FloorWithUsages[] => {
  const storedRepartition = props.question.value ? JSON.parse(props.question.value) as FloorWithUsages[] : null
  if (!storedRepartition) {
    return getInitialRepartition(surveyValues)
  }
  else {
    const repartition = updateRepartition(storedRepartition, surveyValues)
    // Check if every usage in stored repartition is still in the survey
    repartition
      .forEach((floor) => {
        floor.usages = floor.usages.filter(u => selectableUsages.some(({ usage }) => isStrictSameUsage(u, usage)))
      })
    return repartition
  }
}

const {
  floorsWithUsages,
  activeFloorId,
  doesUsageMatch,
  updateFloorUsage,
  duplicateFloorRepartition,
  isGroundFloor,
  isFlatRoof,
  isEmpty,
  isLowest,
  isHighest,
  isActive,
  activatePrevFloor,
  activateNextFloor,
} = useBuildingRepartitionModel(
  doGetInitialRepartition(),
)

watch(floorsWithUsages, (value) => {
  // eslint-disable-next-line vue/no-mutating-props
  props.question.value = JSON.stringify(value)
}, { deep: true })
</script>

<template>
  <div>
    <div
      :class="[
        'building-matrix',
        'flex flex-col md:flex-row gap-16 md:gap-8 lg:gap-16 justify-stretch mt-8',
      ]"
    >
      <SelectableFloors
        :class="[
          'md:basis-35% grow-1 shrink-0 max-w-64',
        ]"
        :active-floor-id="activeFloorId"
        :floors-with-usages="floorsWithUsages"
        :is-active="isActive"
        :is-empty="isEmpty"
        :is-ground-floor="isGroundFloor"
        :is-flat-roof="isFlatRoof"
        @update:active-floor-id="id => activeFloorId = id"
      />
      <div
        :class="[
          'building-matrix__floor-usages',
          'basis-65% grow-1 shrink-1 max-w-128 md:pl-8 lg:pl-16',
        ]"
      >
        <h3 class="mb-0">
          {{ getFloorLabel(activeFloorId, isFlatRoof(activeFloorId), { format: 'long' }) }}
        </h3>
        <p class="text-sm text-gray-500 mt-2 mb-8">
          Sélectionnez les usages présents sur cet étage.
        </p>
        <fieldset
          :class="[
            'building-matrix__usages',
            'flex flex-row flex-wrap gap-2 min-w-0',
          ]"
        >
          <CategoryViewer
            v-for="{
              usage, usageUserLabel, category, categoryType, subCategory, categoryText, subCategoryText,
            } in selectableUsages"
            :key="getUsageKey(usage)"
            :class="[
              'building-matrix__usage',
              {
                'flex-basis-100%': categoryType === 'primary',
                'flex-basis-40% flex-grow-1 flex-shrink-1': categoryType === 'secondary',
              },
            ]"
            is-inline
            :category="category"
            :sub-category="subCategory"
            :category-text="categoryText"
            :sub-category-text="subCategoryText"
            :usage-user-label="usageUserLabel"
            size="sm"
            has-input
            :checked="doesUsageMatch(usage)"
            @click="updateFloorUsage(usage, activeFloorId)"
          />
        </fieldset>
        <div class="mt-8">
          <div class="button-group">
            <PcoButton
              size="sm"
              icon-right
              secondary
              :disabled="isLowest(activeFloorId)"
              label="Étage précédent"
              icon="ri:arrow-left-line"
              @click="activatePrevFloor"
            />
            <PcoButton
              size="sm"
              secondary
              :disabled="isHighest(activeFloorId)"
              label="Étage suivant"
              icon="ri:arrow-right-line"
              @click="activateNextFloor"
            />
          </div>
          <div class="button-group">
            <button
              :disabled="isHighest(activeFloorId)"
              class="button button--sm button--secondary"
              @click="() => {
                duplicateFloorRepartition({
                  from: activeFloorId,
                  to: activeFloorId + 1,
                })
                activeFloorId = activeFloorId + 1
              }"
            >
              Appliquer cette répartition à l'étage suivant
              <Icon name="ri:file-copy-line" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.building-matrix__floor-usages {
  text-wrap: wrap;

  @include over-md {
    border-left: 1px solid $border--default;
  }
}
</style>
