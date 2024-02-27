import { defineStore } from 'pinia'

const OPTIONS = {
  // persist: false,
  persist: true,
}

export const useSurveyReportsStore = defineStore('survey-reports', useDefineSurveyRecordsStore, OPTIONS)

function useDefineSurveyRecordsStore() {
  const previousReports = ref<{
    id: string
    schemaId: string | number
  }[]>([])

  const { surveySchemaId } = useAppConfig()

  const validPreviousReports = computed(() => {
    return previousReports.value.filter((report) => {
      return report.schemaId === surveySchemaId
    })
  })

  const addReportId = (id: string) => {
    previousReports.value.push({
      id,
      schemaId: surveySchemaId,
    })
  }
  const isValidReport = (id: string) => {
    return validPreviousReports.value
      .some((report) => {
        return report.id === id
      })
  }

  return {
    previousReports,
    validPreviousReports,
    isValidReport,
    addReportId,
  }
}
