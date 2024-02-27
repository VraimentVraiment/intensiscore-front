import { expect } from 'vitest'

describe('Compute floor score', () => {

  it('should return 0 when usagesScores is empty', () => {
    const floor: FloorWithUsages = {
      id: 1,
      isRoof: false,
      usages: [{
        'building-usage__id': 'usage_id',
      }],
    }
    const score = computeFloorScore(floor, [])

    expect(score).toBe(0)
  })

  it('should return 0 when usages is empty', () => {
    const floor: FloorWithUsages = {
      id: 1,
      isRoof: false,
      usages: [],
    }
    const score = computeFloorScore(floor, [{
      'building-usage__id': 'usage_id',
      score: 1,
    }])

    expect(score).toBe(0)
  })

  it('should return 0 when usageId is not found in usagesScores', () => {
    const floor: FloorWithUsages = {
      id: 1,
      isRoof: false,
      usages: [{
        'building-usage__id': 'usage_id',
      }],
    }
    const score = computeFloorScore(floor, [{
      'building-usage__id': 'usage2_id',
      score: 1,
    }])

    expect(score).toBe(0)
  })

  it('should return 1 when every floor usage has a score of 1', () => {
    const floor: FloorWithUsages = {
      id: 1,
      isRoof: false,
      usages: [
        {
          'building-usage__id': 'usage_id',
        },
        {
          'building-usage__id': 'usage2_id',
        },
      ],
    }
    const score = computeFloorScore(floor, [
      {
        'building-usage__id': 'usage_id',
        score: 1,
      },
      {
        'building-usage__id': 'usage2_id',
        score: 1,
      },
    ])

    expect(score).toBe(1)
  })

  it('should return 0 when every floor usage has a score of 0', () => {
    const floor: FloorWithUsages = {
      id: 1,
      isRoof: false,
      usages: [
        {
          'building-usage__id': 'usage_id',
        },
        {
          'building-usage__id': 'usage2_id',
        },
      ],
    }
    const score = computeFloorScore(floor, [
      {
        'building-usage__id': 'usage_id',
        score: 0,
      },
      {
        'building-usage__id': 'usage2_id',
        score: 0,
      },
    ])

    expect(score).toBe(0)
  })

  it('should return a number between 0 and 1 in every other case', () => {
    const floor: FloorWithUsages = {
      id: 1,
      isRoof: false,
      usages: [
        {
          'building-usage__id': 'usage_id',
        },
        {
          'building-usage__id': 'usage2_id',
        },
      ],
    }

    const mockData = [
      {
        score1: 0.25,
        score2: 0.75,
      },
      {
        score1: 1,
        score2: 0,
      },
      {
        score1: 0,
        score2: 1,
      },
    ]

    mockData.forEach(({ score1, score2 }) => {
      const score = computeFloorScore(floor, [
        {
          'building-usage__id': 'usage_id',
          score: score1,
        },
        {
          'building-usage__id': 'usage2_id',
          score: score2,
        },
      ])

      expect(score).toBeGreaterThan(0)
      expect(score).toBeLessThan(1)
    })
  })
})
