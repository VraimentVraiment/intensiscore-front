import * as SurveyVue3UI from 'survey-vue3-ui' // named import does not work on build because package uses commonjs

import { FunctionFactory } from 'survey-core'
import { v4 as uuidv4 } from 'uuid'

import CustomChoiceItem from '@/components/survey/CustomChoiceItem.vue'
import CustomProgressBar from '@/components/survey/CustomProgressBar.vue'
import CustomBuildingMatrix from '@/components/survey/CustomBuildingMatrix.vue'
import CustomWeeksPicker from '@/components/survey/CustomWeeksPicker.vue'

FunctionFactory.Instance.register('uuidv4', () => {
  return uuidv4()
})

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp
    .use(SurveyVue3UI.surveyPlugin)
    .component('custom-choice-item', CustomChoiceItem)
    .component('custom-progressbar', CustomProgressBar)
    .component('custom-building-matrix', CustomBuildingMatrix)
    .component('custom-weeks-picker', CustomWeeksPicker)
})
