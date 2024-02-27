export const weekSliceKeysMap: Record<WeekSliceGroupKey, WeekSliceDirectKey[]> = {
  'all': ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
  'week': ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
  'week-end': ['saturday', 'sunday'],
}

export const weekSliceDirectKeys: WeekSliceDirectKey[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
export const weekSliceGroupKeys: WeekSliceGroupKey[] = ['all', 'week', 'week-end']

export const weekSlicesDescriptionChoices: SurveyChoice[] = [
  {
    value: 'openingWeeksDescription-identical',
    text: '**Tous les jours de la semaine** sont fréquentés de manière similaire.',
  },
  {
    value: 'openingWeeksDescription-binary',
    text: 'Les **5 premiers jours** de la semaine sont fréquentés de manière similaire,<br>les **2 jours du week-end** de manière similaire',
  },
  {
    value: 'openingWeeksDescription-mixed',
    text: 'Les **5 premiers jours** de la semaine sont fréquentés de manière similaire,<br>le **samedi** est différent du **dimanche**.',
  },
  {
    value: 'openingWeeksDescription-none',
    text: 'Les variations de fréquentation sont encore **différentes** des cas précédents.',
  },
]

export const getSliceSchemaKey = (key: WeekSliceKey): UsageWeekSliceKey => {
  return ('building-usage_i__hourlyIntensity' + '__' + key) as UsageWeekSliceKey
}

export const getWeekSliceHourlyIntensity = ({
  key,
  label = 'Lors d’une journée type',
  conditions,
}: {
  key: WeekSliceKey
  label: string
  conditions: string[]
}) => {
  return {
    type: 'matrix',
    name: getSliceSchemaKey(key),
    title: label + ', quelle est la fréquentation de cet usage, selon les moments de la journée ?',
    description: '{panel.building-usage__userLabel}.<br><br>**Ce n\'est pas grave si les horaires ne correspondent pas exactement à votre usage, une approximation suffit !**',
    isRequired: true,
    requiredErrorText: 'Veuillez sélectionner une option',
    isAllRowRequired: true,
    columns: DAY_SLICES_SCHEMA_COLUMNS,
    visibleIf: conditions.map(condition => `{panel.building-usage__weekFrequentationDescription} = "${condition}"`).join(' or '),
    // defaultValue: defaultDaySlices, // not working, we are setting defaults in the createSurvey.ts script
    rows: daySlicesSchemaRows,
  }
}

export const getUsageWeekSlices = (
  usage: RawUsageTimings,
): WeekSlice[] => {
  const openingWeeksDescription = usage['building-usage__weekFrequentationDescription']
  const weekSlices = weekSlicesOptions
    .filter((weekSlice) => {
      return weekSlice.conditions.includes(openingWeeksDescription)
    })
    .map((weekSlice) => {
      const sliceKey = getSliceSchemaKey(weekSlice.key) as keyof RawUsageTimings
      const values = usage[sliceKey] as unknown as DaySlices
      return {
        key: weekSlice.key,
        values,
      }
    })
  return weekSlices
}

export const weekSlicesOptions: {
  key: WeekSliceKey
  label: string
  conditions: string[]
}[] = [
  {
    key: 'monday',
    label: 'Lors d\'un **lundi** type',
    conditions: ['openingWeeksDescription-none'],
  },
  {
    key: 'tuesday',
    label: 'Lors d\'un **mardi** type',
    conditions: ['openingWeeksDescription-none'],
  },
  {
    key: 'wednesday',
    label: 'Lors d\'un **mercredi** type',
    conditions: ['openingWeeksDescription-none'],
  },
  {
    key: 'thursday',
    label: 'Lors d\'un **jeudi** type',
    conditions: ['openingWeeksDescription-none'],
  },
  {
    key: 'friday',
    label: 'Lors d\'un **vendredi** type',
    conditions: ['openingWeeksDescription-none'],
  },
  {
    key: 'week',
    label: 'Lors d\'une **semaine** (lundi au vendredi) type',
    conditions: [
      'openingWeeksDescription-binary',
      'openingWeeksDescription-mixed',
    ],
  },
  {
    key: 'week-end',
    label: 'Lors d\'un **week-end** type',
    conditions: ['openingWeeksDescription-binary'],
  },
  {
    key: 'saturday',
    label: 'Lors d\'un **samedi** type',
    conditions: [
      'openingWeeksDescription-none',
      'openingWeeksDescription-mixed',
    ],
  },
  {
    key: 'sunday',
    label: 'Lors d\'un **dimanche** type',
    conditions: [
      'openingWeeksDescription-none',
      'openingWeeksDescription-mixed',
    ],
  },
  {
    key: 'all',
    label: 'Lors d\'un **jour de la semaine** (lundi au dimanche) type',
    conditions: ['openingWeeksDescription-identical'],
  },
]
