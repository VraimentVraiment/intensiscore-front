import { expect } from 'vitest'

describe('Compute week slice score', () => {

  it('should return 0 when every DaySlices is 0', () => {
    const weekSlice: WeekSlice = {
      key: 'all',
      values: {
        morning: 0,
        noon: 0,
        afternoon: 0,
        'late-afternoon': 0,
        evening: 0,
        night: 0,
      },
    }

    const score = computeWeekSliceScore(weekSlice)

    expect(score.scorePerDay).toBe(0)
    expect(score.nDays).toBe(7)
  })

  it('Should return 1 when every DaySlices is 2', () => {
    const weekSlice: WeekSlice = {
      key: 'all',
      values: {
        morning: 2,
        noon: 2,
        afternoon: 2,
        'late-afternoon': 2,
        evening: 2,
        night: 2
      },
    }

    const score = computeWeekSliceScore(weekSlice)
    expect(score.scorePerDay).toBe(1)
    expect(score.nDays).toBe(7)
  })
})
