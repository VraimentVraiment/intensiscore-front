import { defineStore } from 'pinia'
import {
  type SurveyModel,
} from 'survey-core'

const OPTIONS = {
  // persist: false,
  persist: true,
}

export const useSurveyStateStore = defineStore('survey-state', useDefineSurveyStore, OPTIONS)

type SurveyState = {
  data: SurveyModel['data']
  schemaId: number | string
  pageNo: number
}

function useDefineSurveyStore() {
  const { surveySchemaId } = useAppConfig()
  const surveyState: Ref<SurveyState | null> = ref(null)

  const hasSurveyState = computed(() => surveyState.value !== null)

  const save = (survey: SurveyModel) => {
    surveyState.value = {
      data: survey.data,
      schemaId: surveySchemaId,
      pageNo: survey.currentPageNo,
    }
  }

  const clear = () => {
    surveyState.value = null
  }

  const restore = (survey: SurveyModel) => {
    if (import.meta.client) {
      if (surveyState.value) {
        if (surveySchemaId === surveyState.value.schemaId) {
        // Restore survey state if schemaId matches
          survey.data = surveyState.value.data
          survey.currentPageNo = surveyState.value.pageNo
        }
        else {
        // Clear survey stored state if schemaId doesn't match
          clear()
        }
      }
    }
  }

  const bindSurvey = (survey: SurveyModel) => {
    restore(survey)
    survey.onValueChanged.add(save)
    survey.onCurrentPageChanged.add(save)
    survey.onComplete.add(clear)
  }

  return {
    surveyState,
    hasSurveyState,
    save,
    restore,
    clear,
    bindSurvey,
  }
}
