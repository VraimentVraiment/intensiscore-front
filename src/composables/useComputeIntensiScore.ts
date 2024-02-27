export function useComputeIntensiScore({
  usagesTimings,
  floorsWithUsages,
  selectedDaySlices,
  selectedWeekSlice,
}: {
  usagesTimings: UsageTimings[]
  floorsWithUsages: FloorWithUsages[]
  selectedDaySlices?: DaySliceDef[] | Ref<DaySliceDef[]>
  selectedWeekSlice?: WeekSliceGroupKey | Ref<WeekSliceGroupKey>
}) {
  const usagesScores = computed(() => {
    const scores = usagesTimings
      .map((usageTimings) => {
        const usageScore = computeUsageScore(usageTimings, unref(selectedDaySlices), unref(selectedWeekSlice))
        const score = !usageTimings?.['building-usage_i__isOffice']
          ? usageScore
          : interpolateScore({ // If usage is an office, we interpolate the score with an additional coefficient
            score: usageScore,
            coef: computeOfficeScore(usageTimings),
            pivot: 0.5,
            maxUp: 0.33,
            maxDown: 0.33,
          })
        return {
          'building-usage__id': getUsageId(usageTimings) as string,
          score,
        }
      })
    return scores
  })

  const floorsScores = computed(() => {
    const scores = floorsWithUsages
      .filter((floor) => {
        return !hasFloorOnlySecondaryUsages(floor)
      })
      .map((floor) => {
        return {
          id: floor.id,
          score: computeFloorScore(floor, usagesScores.value),
        }
      })
    return scores
  })

  const totalScore = computed(() => {
    const mean = weightedMean(floorsScores.value, floor => floor.score)
    return mean
  })

  return {
    usagesScores,
    floorsScores,
    totalScore,
  }
}
