import { expect } from 'vitest'

describe('Compute day score', () => {

  it('should return 0 when daySlices is empty', () => {
    const score = computeDayScore({} as DaySlices)

    expect(score).toBe(0)
  })

  it('should return 0 when every slice is 0', () => {
    const daySlices: DaySlices = {
      morning: 0,
      noon: 0,
      afternoon: 0,
      'late-afternoon': 0,
      evening: 0,
      night: 0,
    }

    const score = computeDayScore(daySlices)

    expect(score).toBe(0)
  })

  it('Should return 1 when every slice is 2', () => {
    const daySlices: DaySlices = {
      morning: 2,
      noon: 2,
      afternoon: 2,
      'late-afternoon': 2,
      evening: 2,
      night: 2,
    }

    const score = computeDayScore(daySlices)

    expect(score).toBe(1)
  })

  it('Should return a number between 0 and 1 in every other case', () => {
    const daySlicesArr: DaySlices[] = [
      {
        morning: 1,
        noon: 1,
        afternoon: 1,
        'late-afternoon': 1,
        evening: 1,
        night: 1,
      },
      {
        morning: 0,
        noon: 0,
        afternoon: 0,
        'late-afternoon': 0,
        evening: 0,
        night: 1,
      },
      {
        morning: 0,
        noon: 1,
        afternoon: 1,
        'late-afternoon': 1,
        evening: 1,
        night: 1,
      },
    ]

    daySlicesArr.forEach(daySlices => {
      const score = computeDayScore(daySlices)
      expect(score).toBeGreaterThan(0)
      expect(score).toBeLessThan(1)
    })
  })
})
