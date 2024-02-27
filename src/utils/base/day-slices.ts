export const DAY_SLICES: DaySliceDef[] = [
  {
    key: 'morning',
    text: 'Matinée',
    start: 8,
    end: 12,
  },
  {
    key: 'noon',
    text: 'Midi',
    start: 12,
    end: 14,
  },
  {
    key: 'afternoon',
    text: 'Après-midi',
    start: 14,
    end: 18,
  },
  {
    key: 'late-afternoon',
    text: 'Fin d\'après-midi',
    start: 18,
    end: 20,
  },
  {
    key: 'evening',
    text: 'Soirée',
    start: 20,
    end: 22,
  },
  {
    key: 'night',
    text: 'Nuit',
    start: 22,
    end: 8,
  },
]

export const daySlicesSchemaRows: SurveyChoice[] = DAY_SLICES
  .map((slice) => {
    return {
      value: slice.key,
      text: `**${slice.text}**<br>(${slice.start}h - ${slice.end}h)`,
    }
  })

export const DAY_SLICES_SCHEMA_COLUMNS: SurveyChoice<number>[] = [
  {
    value: 0,
    text: 'Pas fréquenté',
  },
  {
    value: 1,
    text: 'Fréquentation normale',
  },
  {
    value: 2,
    text: 'Pic de fréquentation',
  },
]

const DEFAULT_SlICE_VALUE = 1
export const defaultDaySlices: DaySlices = DAY_SLICES
  .reduce((acc, slice) => {
    acc[slice.key] = DEFAULT_SlICE_VALUE
    return acc
  }, {} as DaySlices)
