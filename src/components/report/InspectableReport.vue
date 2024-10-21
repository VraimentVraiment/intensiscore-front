<script setup lang="ts">
defineProps<InspectableReportProps>()

const renderMode = ref<SvgBuildingRenderMode>('usages-scores')

const {
  selectedDaySlices,
  daySlicesLabel,
} = storeToRefs(useSelectedDaySlicesStore())

const {
  selectedWeekSlice,
} = storeToRefs(useSelectedWeekSliceStore())
</script>

<template>
  <div class="flex flex-col md:flex-row gap-8 lg:gap-12  lg:px-6 lg:py-2">
    <div class="md:flex-1 lg:basis-36% grow-1 shrink-1">
      <h3 class="text-lg">
        Explorer votre Intensi'Score
      </h3>
      <p class="text-sm text-gray-500 mt--2">
        sur une période spécifique
      </p>
      <ScoreViewer :score="totalScore" />
      <!-- <TestScoreViewer /> -->
      <div
        :class="[
          'flex flex-col gap-4 mt-12',
        ]"
      >
        <InlineFieldset
          v-model="selectedWeekSlice"
          title="Période de la semaine"
          type="radio"
          :inputs="[
            { label: 'Semaine entière', value: 'all' },
            { label: 'Lun. à Ven.', value: 'week' },
            { label: 'Week-end', value: 'week-end' },
          ]"
        />
        <CustomListBox
          v-model="selectedDaySlices"
          multiple
          :button-label="daySlicesLabel"
          :items="DAY_SLICES"
          size="md"
          label="Plages horaires"
        />
      </div>
    </div>
    <div class="v-divider basis-1px" />
    <div class="md:flex-1 lg:basis-63% grow-1 shrink-1 flex">
      <div class="">
        <h3 class="text-lg">
          Explorer votre bâtiment
        </h3>
        <p class="text-sm text-gray-500 mt--2">
          sur la période selectionnée
        </p>
        <ReportBuilding
          :floors-scores="floorsScores"
          :floors-with-usages="floorsWithUsages"
          :usages-scores="usagesScores"
          :usages-ids="usagesIds"
          :render-mode="renderMode"
        />
        <InlineFieldset
          v-model="renderMode"
          class="mt-6"
          :class="[
          ]"
          title="Mode de représentation"
          type="radio"
          :inputs="[
            { label: 'Score par usage', value: 'usages-score' },
            { label: 'Score par étage', value: 'floors-scores' },
            { label: 'Usages', value: 'usages' },
          ]"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .global-report {
    .tooltip__score {
      border-radius: 0.5rem;
    }
  }
</style>
