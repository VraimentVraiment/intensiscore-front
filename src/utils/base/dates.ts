import * as d3 from 'd3'

export const N_WEEKS_PER_YEAR = 52
export const N_HOURS_PER_DAY = 24
export const N_DAYS_PER_WEEK = 7
export const N_MONTHS_PER_YEAR = 12

const getDayAfterMonday = (n: number) => new Date(2021, 0, 4 + n) // 2021-01-04 is a Monday

export const weekdays = d3
  .range(N_DAYS_PER_WEEK)
  .map((n) => {
    return (
      getDayAfterMonday(n)
        .toLocaleString('FR-fr', { weekday: 'long' })
        .toLowerCase() as WeekDayValues[number]
    )
  })

export const getYearMonths = () => {
  const yearNow = new Date().getFullYear()

  const months = Array.from({ length: N_MONTHS_PER_YEAR }, (_, i) => {
    const date = new Date(yearNow, i, 1)
    const weekIndex = parseInt(d3.timeFormat('%W')(date), 10) - 1
    return {
      weekIndex,
      text: date.toLocaleString(undefined, { month: 'short' }),
    }
  })

  return months
}

export const getReportDate = (date: string): string | null => {
  if (!date) {
    return null
  }
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
