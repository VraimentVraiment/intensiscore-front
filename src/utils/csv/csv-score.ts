import * as d3 from 'd3'

export const computeSpaceScore = (d: {
  [key in typeof computableKeys[number]]: string
}) => {
  const slices = hourIntensityKeys.map((key) => {
    const stringValue = d[key]
    const value = DAY_SLICES_SCHEMA_COLUMNS
      .find(column => column.text === stringValue)
      ?.value ?? 0
    const startEnd = key.match(/(\d+)h-(\d+)h/) as RegExpMatchArray
    const [start, end] = startEnd.slice(1).map(Number)
    const timeHour = (end - start + 24) % 24

    const weekSliceKey = key.match(/semaine|samedi|dimanche/) as RegExpMatchArray
    const weekSlice = weekSliceKey[0]
    const dayWeight = weekSlice === 'semaine' ? 5 : 1
    return {
      key,
      timeHour,
      value,
      dayWeight,
    }
  })

  const maxSliceValue = d3.max(DAY_SLICES_SCHEMA_COLUMNS, d => d.value) as number
  const dayScore = d3.sum(slices, slice => slice.value * slice.timeHour)
  const maxScore = d3.sum(slices, slice => maxSliceValue * slice.timeHour)
  const score = dayScoreScale(maxScore)(dayScore)

  const nWeeksPerYear = Number(d.nb_semaines_ouvertes_par_an)
  const weeksPerYearScore = computeWeeksPerYearScore(nWeeksPerYear)
  return score * weeksPerYearScore
}
