<script setup lang="ts">
const props = defineProps<{
  data: CmsSurveyRecord
}>()

const result = parseSurveyResult(props.data.content)

const reportDate = computed(() => {
  return getReportDate(props.data.date_created)
})

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

const {
  totalScore: globalTotalScore,
} = useComputeIntensiScore({
  usagesTimings,
  floorsWithUsages,
})

const getReportFilename = () => {
  const date = new Date(props.data.date_created)
  return `diagnostic-${date.toISOString().replace(/:/g, '-')}`
}

async function downloadSurveyResponses() {
  const rawSurveyResults = JSON.parse(props.data.content)
  const outputString = formatSurveyResult(rawSurveyResults, reportDate.value as string)
  const url = URL.createObjectURL(new Blob([outputString], { type: 'application/txt' }))
  downloadFile({
    filename: `${getReportFilename()}.txt`,
    url,
  })
}

const visualreport = ref<HTMLElement | null>(null)
const downloadReport = async () => {
  if (visualreport.value && import.meta.client) {
    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(visualreport.value, {
        backgroundColor: '#fff',
        // ignoreElements: (element) => {
        //   return element.classList.contains('score-viewer__score')
        // },
        // onclone
        width: 800,
        height: 600,
      })
      // document.body.querySelector('main')
      // ?.insertBefore(canvas, document.body.querySelector('main')?.firstChild as Node)
      downloadFile({
        url: canvas.toDataURL('image/png'),
        filename: `${getReportFilename()}.png`,
      })
    }
    catch (error) {
      console.error(error)
    }
  }
}
</script>

<template>
  <div
    :class="[
      'survey-result-report',
      'flex flex-col gap-16 md:gap-20 lg:gap-24',
    ]"
  >
    <section>
      <ReportMeta
        :survey-label="data.survey_label"
        :report-date="reportDate"
      />
      <div class="button-group max-w-65ch mt-8">
        <PcoButton
          label="Télécharger le diagnostic"
          icon="ri:download-line"
          size="md"
          @click="downloadReport"
        />
        <PcoButton
          label="Télécharger mon questionnaire"
          icon="ri:download-line"
          size="md"
          secondary
          @click="downloadSurveyResponses"
        />
      </div>
    </section>
    <section
      ref="visualreport"
      class="p-8 fixed z-[-999] w-800px h-600px"
    >
      <div>
        <h2 class="text-2xl">
          Vos résultats au diagnostic simple
        </h2>
      </div>
      <div class="flex gap-8 mt-8">
        <div class="flex-1 flex flex-col gap-8">
          <ReportMeta
            :survey-label="data.survey_label"
            :report-date="reportDate"
          />
          <div class="flex flex-col gap-2">
            <h3 class="text-lg m-0">
              Intensi'Score de votre bâtiment
            </h3>
            <p class="text-sm text-gray-500 m-0">
              sur une année type
            </p>
            <ScoreViewer
              :score="globalTotalScore"
              class="mb-12"
              size="lg"
            />
          </div>
        </div>
        <div class="flex-1">
          <ReportScoreInterpretation
            :main-usages="mainUsages"
            :score="globalTotalScore"
            :show-link="false"
          />
        </div>
      </div>
    </section>
    <section>
      <h2>
        Votre résultat
      </h2>
      <div class="large-box">
        <AbstractReport
          :score="globalTotalScore"
          :main-usages="mainUsages"
        />
      </div>
    </section>
    <section>
      <h2>
        Comprendre votre résultat
      </h2>
      <div class="large-box">
        <InspectableReport
          :floors-scores="floorsScores"
          :total-score="totalScore"
          :usages-scores="usagesScores"
          :floors-with-usages="floorsWithUsages"
          :usages-ids="mainUsages"
        />
      </div>
    </section>
    <section>
      <h2>
        Passer à l'action
      </h2>
      <div class="large-box">
        <ClientOnly>
          <ReportRecommandations
            :result="result"
            :score="globalTotalScore"
          />
        </ClientOnly>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.large-box {
  @apply border-1 border-border-default bg-bg-default p-8;

  box-shadow: $shadow--lg;
  border-radius: $border-radius--lg;
}
</style>
