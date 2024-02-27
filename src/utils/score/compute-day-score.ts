import * as d3 from 'd3'

export const INTENSITY_PER_HOUR_EXPONENT = 0.25

export const dayScoreScale = (maxScore: number) => {
  return d3.scalePow()
    .exponent(INTENSITY_PER_HOUR_EXPONENT)
    .domain([0, maxScore])
    .range([0, 1])
    .clamp(true)
}

const maxSliceValue = d3.max(DAY_SLICES_SCHEMA_COLUMNS, d => d.value) as number

const getSelectedDaySlices = (
  daySlices?: DaySlices,
  selectedDaySlices?: DaySliceDef[],
): {
  key: DaySliceKey
  value: number
  timeHour: number
}[] => {
  let slices = DAY_SLICES
    .map((slice) => {
      const timeHour = (slice.end - slice.start + 24) % 24

      return {
        key: slice.key,
        value: daySlices?.[slice.key] ?? 0,
        timeHour,
      }
    })
  if (selectedDaySlices && selectedDaySlices.length > 0) {
    slices = slices
      .filter((slice) => {
        return selectedDaySlices
          .some((s) => {
            return s.key === slice.key
          })
      })
  }

  return slices
}

export const computeDayScore = (
  daySlices?: DaySlices,
  selectedDaySlices?: DaySliceDef[],
): number => {
  if (
    !daySlices
    || Object.keys(daySlices).length === 0
  ) {
    return 0
  }

  const slices = getSelectedDaySlices(daySlices, selectedDaySlices)
  const dayScore = d3.sum(slices, slice => slice.value * slice.timeHour)
  const maxScore = d3.sum(slices, slice => maxSliceValue * slice.timeHour)

  return dayScoreScale(maxScore)(dayScore)
}
