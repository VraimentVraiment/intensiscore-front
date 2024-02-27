import * as d3 from 'd3'

export const ACTIVE_WEEKS_PER_YEAR_EXPONENT = 0.5

export const computeWeeksPerYearScore = d3.scalePow()
  .exponent(ACTIVE_WEEKS_PER_YEAR_EXPONENT)
  .domain([0, N_WEEKS_PER_YEAR])
  .range([0, 1])
  .clamp(true)
