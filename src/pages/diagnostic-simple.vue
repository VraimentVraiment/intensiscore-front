<script setup lang="ts">
import '@/styles/survey.scss'

definePageMeta({
  title: 'Le diagnostic',
})

const { addReportId } = useSurveyReportsStore()

const {
  resultId,
  postSurveyResult,
} = usePostSurveyResult()

const survey = createSurvey(surveySchema)
const { surveySchemaId } = useAppConfig()

survey.onComplete.add(function (sender, options) {
  options.showSaveInProgress()

  postSurveyResult(
    sender.data,
    surveySchemaId,
  )
    .then(() => {
      options.showSaveSuccess()
      if (resultId.value) {
        addReportId(resultId.value)
        navigateTo(`/reports/${resultId.value}`)
      }
    })
    .catch((e) => {
      options.showSaveError(e)
    })
})
</script>

<template>
  <AppSection>
    <h1>
      Diagnostic d'intensité d'usage
    </h1>
    <ClientOnly>
      <SurveyComponent :model="survey" />
    </ClientOnly>
    <template v-if="resultId">
      <PcoLink :to="`/reports/${resultId}`">
        Consulter le rapport
      </PcoLink>
    </template>
  </AppSection>
</template>
