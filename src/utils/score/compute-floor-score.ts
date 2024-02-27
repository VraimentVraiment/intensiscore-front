export const computeFloorScore = (
  floor: FloorWithUsages,
  usagesScores: UsageScore[],
): number => {
  if (
    !floor.usages?.length
    || !usagesScores?.length
  ) {
    return 0
  }

  const floorUsagesScores = floor.usages
    .filter((usage) => {
      if (isActuallySecondary(usage)) {
        return false
      }
      return true
    })
    .map((usage) => {
      const usageScore = usagesScores.find((usageScore) => {
        return isSameUsage(usage, usageScore)
      })
      if (usageScore) {
        return usageScore
      }
      else {
        return { score: 0, ...usage }
      }
    })

  if (floorUsagesScores.length === 0) {
    return 0
  }
  return weightedMean(floorUsagesScores, usageScore => usageScore.score)
}
