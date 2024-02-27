/* eslint-disable no-irregular-whitespace */
import {
  Model,
} from 'survey-core'

export const formatSurveyResult = (
  result: SurveyResultModel,
  date: string,
): string => {
  const { surveySchemaId } = useAppConfig()
  const survey = new Model(surveySchema)
  survey.data = result
  const surveyLabel = survey.getQuestionByName('survey-label')?.value as string
  const resultData = [
    [
      'Diagnostic d\'intensité d\'usage',
      `- Version du questionnaire : ${surveySchemaId}`,
      surveyLabel && `- Date du questionnaire : ${date}`,
      `- Libellé du questionnaire : ${surveyLabel}`,

    ]
      .filter(Boolean)
      .join('\n'),
  ]
  const ignoreKeys = [
    'building-mainUsages',
    'building-usageRepartition',
    'building-usagesTimings',
  ]
  for (const key in survey.data) {
    if (ignoreKeys.includes(key)) {
      continue
    }
    const question = survey.getQuestionByName(key)
    if (question) {
      const item = [
        question.title,
        JSON.stringify(question.displayValue),
      ].join('\n')
      resultData.push(item)
    }
  }
  const usagesIds = survey.getQuestionByName('building-mainUsages').value as UsageIds[]
  const secondaryUsages = parseSecondaryUsages(survey)
  const usagesTimings = survey.getQuestionByName('building-usagesTimings').value as RawUsageTimings[]
  const usagesRepartition = JSON.parse(survey.getQuestionByName('building-usageRepartition').value as string) as FloorWithUsages[]
  resultData.push(formatUsages(usagesIds, usagesTimings))
  resultData.push(formatUsageRepartition(usagesRepartition, [...usagesIds, ...secondaryUsages]))

  const str = resultData.join('\n\n------\n\n')

  return str
}

function formatUsages(
  usages: UsageIds[],
  usagesTimings: RawUsageTimings[],
) {
  const result = usages.map((usage, i) => {
    const title = usage['building-usage__userLabel']
    const usageTimings = usagesTimings.find(usageTimings => isSameUsage(usage, usageTimings)) as RawUsageTimings
    const category = getCategoryLabel(usage['building-usage__category'])
    const subCategory = getCategoryLabel(usage['building-usage__subCategory'])
    const nWeeks = parseUsageWeeks(usageTimings)?.length
    const weekSlices = getUsageWeekSlices(usageTimings)
    const weekDescriptionKey = usageTimings['building-usage__weekFrequentationDescription']
    const weekDescription = removeMdTags(weekSlicesDescriptionChoices.find(choice => choice.value === weekDescriptionKey)?.text)

    const formatWeekSlices = weekSlices.map((slice) => {
      const option = weekSlicesOptions.find(option => option.key === slice.key)
      const values = Object.entries(slice.values)
        .map(([key, value]) => {
          const slice = daySlicesSchemaRows.find(slice => slice.value === key)
          const displayValue = DAY_SLICES_SCHEMA_COLUMNS.find(column => column.value === value)?.text
          return `\t- ${removeMdTags(slice?.text)} : ${displayValue}`
        })
        .join('\n')
      return `\n- ${removeMdTags(option?.label)}\n${values}`
    })
      .join('')

    const rows = [
      `Libellé :\n"${title}"`,
      `Catégorie :\n${category}`,
      `Sous-catégorie :\n${subCategory}`,
      `Nombre de semaines d'ouverture par an :\n${nWeeks}`,
      `Type de semaine :\n${weekDescription}`,
      `Fréquentation hebdomadaire :\n${formatWeekSlices}`,
    ]

    return `Usage ${i + 1}\n\n${rows.join('\n\n')}`
  })
    .join('\n\n---\n\n')

  return result
}

function formatUsageRepartition(
  usageRepartition: FloorWithUsages[],
  usagesIds: UsageIds[],
) {
  const values = usageRepartition
    .map((floor: FloorWithUsages) => {
      const floorLabel = getFloorLabel(floor['id'], floor['isRoof'], { format: 'long' })
      const usages = floor['usages']
        ?.map((withUsageId) => {
          const usage = usagesIds.find(u => isSameUsage(u, withUsageId)) as UsageIds
          if (usage) {
            return getCategoryLabel(usage['building-usage__category'])
          }
        })
        .filter(Boolean) as string[]
      return `- ${floorLabel} : ${usages.map(d => `\n\t- ${d}`)}`
    })

  return `Répartition des usages par étage\n\n${values.join('\n\n')}`
}

function removeMdTags(str?: string) {
  if (!str) {
    return ''
  }
  return str.replace(/\*\*/g, '')
    .replace(/<br>/g, ' ')
}
