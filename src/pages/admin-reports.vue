<script setup lang="ts">
import { useAsyncData } from '#app'

definePageMeta({
  middleware: ['admin'],
})

const { data: reports, error, pending } = useAsyncData('previous-reports', async () => {
  const data = await $fetch('/api/reports/list', {
    method: 'POST',
    body: {
      admin: true,
    },
  })
  return data ?? []
}, {
  server: false,
})

const selectedReport = ref<CmsSurveyRecord | null>(null)

const reportData = ref<null | object>(null)
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
    floorsScores,
    totalScore,
    usagesScores,
    floorsWithUsages,
    mainUsages,
  }

  selectedReport.value = report
}

const closeSelectedReport = () => {
  selectedReport.value = null
}

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
        <div
          v-for="report in reports"
          :key="report.id"
          class="report-card p-4 bg-white border default-border-box flex flex-col gap-4 justify-between"
        >
          <div>
            <p class="text-lg mb-2 font-bold">
              {{ report.survey_label || `Report ${report.id}` }}
            </p>
            <p class="mt-1 text-sm text-gray-500">
              {{ new Date(report.date_created).toLocaleString() }}
            </p>
          </div>
          <PcoButton
            label="View Report"
            @click="setSelectedReport(report)"
          />
        </div>
      </div>
      <div
        v-if="selectedReport"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <div class="bg-white p-6 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
          <h2 class="text-2xl mb-4">
            {{ selectedReport.survey_label || `Report ${selectedReport.id}` }}
          </h2>
          <InspectableReport
            v-if="reportData"
            :floors-scores="reportData.floorsScores"
            :total-score="reportData.totalScore"
            :usages-scores="reportData.usagesScores"
            :floors-with-usages="reportData.floorsWithUsages"
            :usages-ids="reportData.mainUsages"
          />
          <div class="flex justify-between mt-4">
            <PcoButton
              label="Previous"
              @click="navigateReport('prev')"
            />
            <PcoButton
              label="Close"
              @click="closeSelectedReport"
            />
            <PcoButton
              label="Next"
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

<style scoped lang="scss">
.report-card {
  border-radius: $border-radius--md;
  border: solid 1px $border--default;
  box-shadow: $shadow--md;
}
</style>
