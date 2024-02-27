// src/utils/score/__tests__/intensiscore-scales.test.ts
import { describe, it, expect } from 'vitest'
import {
  scoreInterpretation,
  scoreOpportunities
} from '../intensiscore-scales'

describe('intensiscore-scales', () => {
  it('should have matching lengths for interpretation and opportunities', () => {
    expect(scoreInterpretation.length).toBe(scoreOpportunities.length)
  })

  it('should have 5 levels of interpretation', () => {
    expect(scoreInterpretation.length).toBe(5)
  })
})
