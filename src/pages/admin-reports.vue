<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'

definePageMeta({
  middleware: ['admin'],
})

const { data: reports, error, pending } = useAsyncData<CmsSurveyRecord[]>('previous-reports', async () => {
  const data = await $fetch('/api/reports/list', {
    method: 'POST',
    body: {
      admin: true,
      sort: '-date_created',
    },
  })
  return data ?? []
}, {
  server: false,
})

const selectedReport = ref<CmsSurveyRecord | null>(null)

const reportData = ref(null) as Ref<InspectableReportProps | null>
const setSelectedReport = async (report: CmsSurveyRecord) => {
  const { data } = await $fetch(`/api/reports/${report.id}`)
  const result = parseSurveyResult(data.content)

  const { selectedDaySlices } = storeToRefs(useSelectedDaySlicesStore())
  const { selectedWeekSlice } = storeToRefs(useSelectedWeekSliceStore())

  const mainUsages = result['building-mainUsages']
  const usagesTimings = result['building-usagesTimings']
  const floorsWithUsages = result['building-usageRepartition']

  const {
    totalScore,
    usagesScores,
    floorsScores,
  } = useComputeIntensiScore({
    usagesTimings,
    floorsWithUsages,
    selectedDaySlices,
    selectedWeekSlice,
  })
  reportData.value = {
    floorsScores: floorsScores.value,
    totalScore: totalScore.value,
    usagesScores: usagesScores.value,
    floorsWithUsages: floorsWithUsages,
    usagesIds: mainUsages,
  }

  selectedReport.value = report
}

const closeSelectedReport = () => {
  selectedReport.value = null
}
const modal = ref<HTMLElement | null>(null)
onClickOutside(modal, () => {
  if (selectedReport.value) {
    closeSelectedReport()
  }
})

const navigateReport = (direction: 'next' | 'prev') => {
  if (!selectedReport.value || !reports.value) return

  const currentIndex = reports.value.findIndex(report => report.id === selectedReport.value?.id)
  let newIndex

  if (direction === 'next') {
    newIndex = currentIndex + 1 >= reports.value.length ? 0 : currentIndex + 1
  }
  else {
    newIndex = currentIndex - 1 < 0 ? reports.value.length - 1 : currentIndex - 1
  }

  setSelectedReport(reports.value[newIndex])
}
</script>

<template>
  <AppSection>
    <h1>Admin: Survey Reports</h1>
    <PcoSpinner v-if="pending" />
    <p v-else-if="error">
      An error occurred while loading the reports: {{ error }}
    </p>
    <template v-else-if="reports?.length">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ReportCard
          v-for="report, i in reports"
          :key="report.id"
          :number="reports.length - i"
          :date="(getReportDate(report.date_created) as string)"
          :survey-label="report.survey_label"
          @click="() => setSelectedReport(report)"
        />
      </div>
      <div
        v-if="selectedReport"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <div
          ref="modal"
          class="bg-bg-default p-6 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto relative"
        >
          <PcoButton
            class="absolute top-4 right-4"
            tertiary
            icon-only
            icon="ri:close-line"
            @click="closeSelectedReport"
          />
          <h2 class="text-2xl mb-4">
            {{ selectedReport.survey_label || `Report ${selectedReport.id}` }}
          </h2>
          <InspectableReport
            v-if="reportData"
            :floors-scores="reportData.floorsScores"
            :total-score="reportData.totalScore"
            :usages-scores="reportData.usagesScores"
            :floors-with-usages="reportData.floorsWithUsages"
            :usages-ids="reportData.usagesIds"
          />
          <div class="flex justify-between mt-12">
            <PcoButton
              label="Précédent"
              secondary
              @click="navigateReport('prev')"
            />
            <PcoButton
              label="Suivant"
              secondary
              @click="navigateReport('next')"
            />
          </div>
        </div>
      </div>
    </template>
    <p v-else>
      No reports found.
    </p>
  </AppSection>
</template>
