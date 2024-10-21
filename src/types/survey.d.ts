declare global {

  type SurveyRecord = {
    survey_schema_id: number
    survey_label?: string
    content: string
  }

  type SurveyChoice<T extends string | number = string> = {
    value: T
    text: string
  }

  type BooleanString = 'yes' | 'no'

  type DaySliceKeys = ['morning', 'noon', 'afternoon', 'late-afternoon', 'evening', 'night']
  type DaySliceKey = DaySliceKeys[number]
  type DaySlices = Record<DaySliceKey, number>
  type DaySliceDef = {
    key: DaySliceKey
    text: string
    start: number
    end: number
  }

  type WeekSliceGroupKey = 'all' | 'week' | 'week-end'
  type WeekSliceDirectKey = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
  type WeekSliceKey = WeekSliceGroupKey | WeekSliceDirectKey
  type WeekSlice = {
    key: WeekSliceKey
    values: DaySlices
  }

  type WeekDayValues = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche']

  type UsageIds = {
    'building-usage__id': string
    'building-usage__userLabel': string
    'building-usage__category': string
    'building-usage__subCategory': string | null
  }

  type WithUsageId = {
    'building-usage__id': string
  }

  type WithUsageCategory = {
    'building-usage__category': string
  }

  type SecondaryUsage = {
    'building-usage__id': string
    'building-usage__category': string
  }

  type BuildingDescription = {
    nFloors: number
    nBasementsLevels: number
    hasFlatRoof: boolean
  }

  type FloorWithUsages = {
    usages: WithUsageId[]
    isRoof: boolean
    id: number
  }

  type OpeningWeeksDescription =
    'openingWeeksDescription-identical' |
    'openingWeeksDescription-binary' |
    'openingWeeksDescription-mixed' |
    'openingWeeksDescription-none'

  type UsageWeekSliceKeys = [
    'building-usage_i__hourlyIntensity__all',
    'building-usage_i__hourlyIntensity__week-end',
    'building-usage_i__hourlyIntensity__week',
    'building-usage_i__hourlyIntensity__monday',
    'building-usage_i__hourlyIntensity__tuesday',
    'building-usage_i__hourlyIntensity__wednesday',
    'building-usage_i__hourlyIntensity__thursday',
    'building-usage_i__hourlyIntensity__friday',
    'building-usage_i__hourlyIntensity__saturday',
    'building-usage_i__hourlyIntensity__sunday',
  ]
  type UsageWeekSliceKey = UsageWeekSliceKeys[number]

  type UsageWeekDaySlices = {
    'building-usage__weekFrequentationDescription': 'openingWeeksDescription-identical'
    'building-usage_i__hourlyIntensity__all': DaySlices
  } | {
    'building-usage__weekFrequentationDescription': 'openingWeeksDescription-binary'
    'building-usage_i__hourlyIntensity__week': DaySlices
    'building-usage_i__hourlyIntensity__week-end': DaySlices
  } | {
    'building-usage__weekFrequentationDescription': 'openingWeeksDescription-mixed'
    'building-usage_i__hourlyIntensity__week': DaySlices
    'building-usage_i__hourlyIntensity__saturday': DaySlices
    'building-usage_i__hourlyIntensity__sunday': DaySlices
  } | {
    'building-usage__weekFrequentationDescription': 'openingWeeksDescription-none'
    'building-usage_i__hourlyIntensity__monday': DaySlices
    'building-usage_i__hourlyIntensity__tuesday': DaySlices
    'building-usage_i__hourlyIntensity__wednesday': DaySlices
    'building-usage_i__hourlyIntensity__thursday': DaySlices
    'building-usage_i__hourlyIntensity__friday': DaySlices
    'building-usage_i__hourlyIntensity__saturday': DaySlices
    'building-usage_i__hourlyIntensity__sunday': DaySlices
  }

  type RawUsageTimings = WithUsageId & {
    'building-usage__openingWeeks': string
    'building-usage__weekFrequentationDescription': OpeningWeeksDescription
    'building-usage__typicalSpaces'?: string[]
  }
  & UsageWeekDaySlices
  & (
      OfficeUsageProps
      | { 'building-usage_i__isOffice': false }
    )

  type OfficeUsageProps = {
    'building-usage_i__isOffice': true
    'building-usage__isOffice__nEmployees': number
    'building-usage__isOffice__surface': number
    'building-usage__isOffice__teleworkRate': number
    'building-usage__isOffice__nWorkstations': number
  }

  type UsageTimings = WithUsageId & {
    'building-usage__openingWeeks': number[]
    'building-usage_i__weekSlices': WeekSlice[]
    'building-usage__typicalSpaces'?: string[]
  } & (
      OfficeUsageProps
      | { 'building-usage_i__isOffice': false }
    )

  type OfficeUsageTimings = UsageTimings & OfficeUsageProps
  type RawOfficeUsageTimings = RawUsageTimings & OfficeUsageProps

  type RawSurveyResultModel = {
    'building-isErp': BooleanString
    'building-hasFlatRoof': BooleanString
    'building-hasCave': BooleanString
    'building-hasBasement': BooleanString
    'building-hasOutdoorSpaces': BooleanString
    'building-hasIndoorParking': BooleanString
    'building-mainUsages': UsageIds[]
    'building-usagesTimings': RawUsageTimings[]
    'building-usageRepartition': string
  }

  type SurveyResultModel = {
    'building-isErp': BooleanString
    'building-hasFlatRoof': BooleanString
    'building-hasCave': BooleanString
    'building-hasBasement': BooleanString
    'building-hasIndoorParking': BooleanString
    'building-hasOutdoorSpaces': BooleanString
    'building-mainUsages': UsageIds[]
    'building-usagesTimings': UsageTimings[]
    'building-usageRepartition': FloorWithUsages[]
  }

  type UsageScore = WithUsageId & {
    score: number
  }

  type FloorScore = {
    id: number
    score: number
  }

  type SvgBuildingRenderMode = 'usages-scores' | 'usages' | 'floors-scores'

  type InspectableReportProps = {
    floorsScores: FloorScore[]
    usagesScores: UsageScore[]
    usagesIds: UsageIds[]
    floorsWithUsages: FloorWithUsages[]
    totalScore: number
  }
}

export { }
