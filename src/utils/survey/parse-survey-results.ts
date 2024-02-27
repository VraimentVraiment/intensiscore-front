import {
  type Model,
} from 'survey-core'

export const parseUsageWeeks = (usage: RawUsageTimings): number[] => {
  return usage['building-usage__openingWeeks']
    ? JSON.parse(usage['building-usage__openingWeeks']) as number[]
    : []
}

export const parseSecondaryUsages = (survey: Model): UsageIds[] => {
  const hasParking = survey.getQuestionByName('building-hasIndoorParking')?.value === 'yes'
  const hasOutdoorSpaces = survey.getQuestionByName('building-hasOutdoorSpaces')?.value === 'yes'
  const hasVacantSpace = survey.getQuestionByName('building-hasVacantSpace')?.value === 'yes'
  const hasCave = survey.getQuestionByName('building-hasCave')?.value === 'yes'

  const secondaryUsages = ([
    hasParking ? getCategorySchema(PARKING_CATEGORY) : null,
    hasOutdoorSpaces ? getCategorySchema(OUTDOOR_SPACES_CATEGORY) : null,
    hasVacantSpace ? getCategorySchema(VACANT_SPACE_CATEGORY) : null,
    hasCave ? getCategorySchema(CAVE_CATEGORY) : null,
    getCategorySchema(UNKNOWN_CATEGORY),
  ]
    .filter(Boolean) as SecondaryUsage[])
    .map(u => ({
      ...u,
      'building-usage__id': getUsageCategory(u) as string,
    })) as UsageIds[]

  return secondaryUsages
}

export const parseUsageTimings = (
  rawUsageTimings: RawUsageTimings[],
  usages: UsageIds[],
): UsageTimings[] => {
  return rawUsageTimings
    .map((usageTiming) => {
      const weekSlices = getUsageWeekSlices(usageTiming)
      const weeks = parseUsageWeeks(usageTiming)
      const usage = usages.find(u => isSameUsage(u, usageTiming)) as UsageIds

      const isOffice = OFFICE_SUBCATEGORIES.includes(usage['building-usage__subCategory'] as string)

      const output = {
        'building-usage__category': usage['building-usage__category'],
        'building-usage__subCategory': usage['building-usage__subCategory'],
        'building-usage__id': usage['building-usage__id'],
        'building-usage__openingWeeks': weeks,
        'building-usage_i__weekSlices': weekSlices,
        'building-usage_i__isOffice': isOffice,
        'building-usage__typicalSpaces': usageTiming['building-usage__typicalSpaces'],
      }

      if (isOffice) {
        const timing = usageTiming as RawOfficeUsageTimings
        Object.assign(output, {
          'building-usage__isOffice__nEmployees': timing['building-usage__isOffice__nEmployees'],
          'building-usage__isOffice__surface': timing['building-usage__isOffice__surface'],
          'building-usage__isOffice__teleworkRate': timing['building-usage__isOffice__teleworkRate'],
          'building-usage__isOffice__nWorkstations': timing['building-usage__isOffice__nWorkstations'],
        })
      }

      return output as UsageTimings
    })
}

export const parseUsageRepartition = (
  rawUsageRepartition: string,
): FloorWithUsages[] => {
  const repartition = JSON.parse(rawUsageRepartition) as FloorWithUsages[]
  return repartition
    .map((floor) => {
      if (floor.usages.length === 0) {
        floor.usages.push({
          'building-usage__id': 'others',
          'building-usage__category': 'others',
        })
      }
      return floor
    })
    .reverse() as FloorWithUsages[]
}

export const parseSurveyResult = (
  rawSurveyResultString: string,
): SurveyResultModel => {
  const rawSurveyResult = JSON.parse(rawSurveyResultString) as RawSurveyResultModel

  const surveyResult = {
    'building-isErp': rawSurveyResult['building-isErp'],
    'building-hasFlatRoof': rawSurveyResult['building-hasFlatRoof'],
    'building-hasBasement': rawSurveyResult['building-hasBasement'],
    'building-hasCave': rawSurveyResult['building-hasCave'],
    'building-hasIndoorParking': rawSurveyResult['building-hasIndoorParking'],
    'building-hasOutdoorSpaces': rawSurveyResult['building-hasOutdoorSpaces'],
    'building-mainUsages': rawSurveyResult['building-mainUsages'],
    'building-usageRepartition': parseUsageRepartition(rawSurveyResult['building-usageRepartition']),
    'building-usagesTimings': parseUsageTimings(
      rawSurveyResult['building-usagesTimings'],
      rawSurveyResult['building-mainUsages'],
    ),
  }

  return surveyResult
}
