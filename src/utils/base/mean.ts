export function weightedMean<T>(
  items: T[],
  getValue: (item: T) => number,
  getWeight: (item: T) => number = () => 1,
): number {
  const mean = getArithmeticWeightedMean(
    items.map(getValue),
    items.map(getWeight),
  )

  return mean
}

export function getArithmeticWeightedMean(values: number[], weights: number[]): number {
  const n = values.length
  let sum = 0
  let weightSum = 0

  for (let i = 0; i < n; i++) {
    const value = values[i]
    const weight = weights[i]
    sum += value * weight
    weightSum += weight
  }

  return sum / weightSum
}
