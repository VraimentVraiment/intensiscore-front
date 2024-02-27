export const computeUsageScore = (
  usage: UsageTimings,
  selectedDaySlices?: DaySliceDef[],
  selectedWeekSlice?: WeekSliceGroupKey,
): number => {
  const usageWeekSlices = usage['building-usage_i__weekSlices']
  const usageOpeningWeeks = usage['building-usage__openingWeeks']

  const weekSlices = getSelectedWeekSlices(usageWeekSlices, selectedWeekSlice)
  const weekScore = computeWeekScore(weekSlices, selectedDaySlices)

  const nActiveWeeksPerYear = getUniqueValuesLength(usageOpeningWeeks)
  const weeksPerYearScore = computeWeeksPerYearScore(nActiveWeeksPerYear)

  const usageScore = weekScore * weeksPerYearScore

  return usageScore
}
