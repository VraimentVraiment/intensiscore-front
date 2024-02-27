import {
  Model,
  type SurveyModel,
} from 'survey-core'

import pkg from 'showdown'

const { Converter } = pkg

export function createSurvey(
  surveySchema: string,
): SurveyModel {
  const survey = new Model(surveySchema)

  const {
    customTheme,
    cssMap,
  } = useAppConfig()

  /**
   * Apply custom theme and css to survey
   */
  survey.applyTheme(customTheme)
  survey.css = cssMap

  /**
   * Add custom progress bar to survey
   */
  survey.addLayoutElement({
    id: 'custom-progressbar',
    component: 'custom-progressbar',
    container: 'header',
    data: survey,
  })

  /**
   * Add markdown support to survey questions
   **/
  const converter = new Converter()
  survey.onTextMarkdown.add(function (_, options) {
    let str = converter.makeHtml(options.text)
    // Remove root paragraphs <p></p>
    str = str.substring(3)
    str = str.substring(0, str.length - 4)
    options.html = str
  })

  /**
   * Sync dynamic panels
   */
  const SOURCE_QUESTION_NAME = 'building-mainUsages'
  const TARGET_QUESTION_NAME = 'building-usagesTimings'
  survey.onAfterRenderQuestion.add(function (survey, options) {
    if (options.question.name === TARGET_QUESTION_NAME) {
      syncDynamicPanels(options.question, survey.getValue(SOURCE_QUESTION_NAME))
    }
  })
  survey.onValueChanged.add(function (survey, options) {
    if (options.name === SOURCE_QUESTION_NAME) {
      syncDynamicPanels(survey.getQuestionByName(TARGET_QUESTION_NAME), options.value)
    }
  })

  /**
   * Counters the effect of "clearInvisibleValues: 'none'" in the survey schema,which we need to keep usage uuid.
   * An invisible question value will get cleared on visibility change, as in clearInvisibleValues: 'onHidden' option
   * NB: Default behavior is "clearInvisibleValues: 'onComplete'" which clears invisible question values on survey completion
   */
  survey.onQuestionVisibleChanged.add(function (_, options) {
    if (options.name === 'building-usage__id') {
      return
    }
    if (!options.question.visible) {
      options.question.value = options.question.defaultValue || null
    }
  })

  /**
   * Setting default value for building-usage_i__hourlyIntensity
   * It is not working right from the survey schema, don't know why
   */
  survey.onAfterRenderQuestion.add(function (survey, options) {
    if (!options.question.name.match('building-usage_i__hourlyIntensity')) {
      return
    }
    if (!options.question.value) {
      options.question.value = defaultDaySlices
    }
  })

  /**
   * Bind survey state store
   */
  useSurveyStateStore().bindSurvey(survey)

  return survey
}
