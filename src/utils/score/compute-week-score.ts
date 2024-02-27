export const getSelectedWeekSlices = (
  weekSlices: WeekSlice[],
  selectedWeekSlice?: WeekSliceGroupKey,
): WeekSlice[] => {
  let slices = weekSlices
  if (selectedWeekSlice && selectedWeekSlice !== 'all') {
    slices = slices
      .filter((slice) => {
        if (slice.key === 'all') {
          return true
        }
        if (weekSliceGroupKeys.includes(slice.key as WeekSliceGroupKey)) {
          return slice.key === selectedWeekSlice
        }
        else {
          const groupKeys = weekSliceKeysMap[selectedWeekSlice]
          return groupKeys?.includes(slice.key as WeekSliceDirectKey)
        }
      })
  }
  return slices
}

export const computeWeekScore = (
  weekSlices: WeekSlice[],
  selectedDaySlices?: DaySliceDef[],
): number => {
  const weekSlicesScores = weekSlices
    .map((slice) => {
      return computeWeekSliceScore(slice, selectedDaySlices)
    })
  const weekScore = weightedMean(
    weekSlicesScores,
    slice => slice.scorePerDay,
    slice => slice.nDays,
  )
  return weekScore
}
