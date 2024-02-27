export const mappedScoreScaleInterpolator = ({
  domain,
  nTicks,
  pivotRatio = 1,
  pivotValue = null,
}: {
  domain: [number, number]
  nTicks: number
  pivotRatio: number
  pivotValue: number | null
}) => {
  return function (minRange: number, maxRange: number) {
    if (pivotValue === null) {
      return (t: number) => minRange * (1 - t) + maxRange * t // scale linear
    }
    const sign = Math.sign(maxRange - minRange)
    const range = Math.abs(maxRange - minRange)
    const regularInterval = pivotValue === null
      ? range / nTicks
      : range / (pivotRatio + nTicks - 1)
    const pivotInterval = pivotValue === null
      ? 0
      : regularInterval * pivotRatio
    let tickCount = 0
    let offset = 0
    return function (t: number) {
      const pivot = pivotValue / domain[1]
      if (t > pivot) {
        offset = pivotInterval - regularInterval
      }
      if (t === 0) {
        return minRange
      }
      if (t === 1) {
        return maxRange
      }
      return minRange + sign * (++tickCount * regularInterval + offset)
    }
  }
}
