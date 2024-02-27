export const computeWeekSliceScore = (
  weekSlice: WeekSlice,
  selectedDaySlices?: DaySliceDef[],
): {
  scorePerDay: number
  nDays: number
} => {
  const scorePerDay = computeDayScore(weekSlice.values, selectedDaySlices)
  const nDays = weekSliceDirectKeys.includes(weekSlice.key as WeekSliceDirectKey)
    ? 1
    : weekSliceKeysMap[weekSlice.key as WeekSliceGroupKey].length
  return {
    scorePerDay,
    nDays,
  }
}
