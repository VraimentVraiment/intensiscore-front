import * as d3 from 'd3'

const maxOfficeProps = {
  nEmployees: 1,
  surface: 10, // the optimal surface for 1 employee we consider
  teleworkRate: 0, // the optimal telework rate we consider
}

const getScore = (nEmployees: number, surface: number, teleworkRate: number): number => {
  const score = (nEmployees * (1 - teleworkRate)) / surface
  return score
}

const maxScore = getScore(maxOfficeProps.nEmployees, maxOfficeProps.surface, maxOfficeProps.teleworkRate)

const OFFICE_SCORE_SCALE_EXPONENT = 0.5

const officeScoreScale = d3.scalePow()
  .exponent(OFFICE_SCORE_SCALE_EXPONENT)
  .domain([0, maxScore])
  .range([0, 1])
  .clamp(true)

export const computeOfficeScore = (usageTimings: OfficeUsageTimings): number => {
  const nEmployees = usageTimings['building-usage__isOffice__nEmployees'] ?? 1
  const surface = usageTimings['building-usage__isOffice__surface'] ?? 15
  const teleworkRate = (usageTimings['building-usage__isOffice__teleworkRate'] ?? 25) / 100

  const score = getScore(nEmployees, surface, teleworkRate)

  return officeScoreScale(score)
}
