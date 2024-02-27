import * as d3 from 'd3'

export function interpolateScore({
  score, // The score to be modulated, between 0 and 1
  coef, // The coefficient to be used for the modulation, between 0 and 1
  pivot = 0.5, // The pivot value for coef, between 0 and 1
  maxUp = 1, // The maximum percentage (expressed as a value between 0 and 1) by which the score can be increased when coef is greater than pivot
  maxDown = 1, // The maximum percentage (expressed as a value between 0 and 1) by which the score can be decreased when coef is lower than pivot
  exponentUp = 0.5, // The exponent for the modulation when coef is greater than pivot
  exponentDown = 0.5, // The exponent for the modulation when coef is lower than pivot
}: {
  score: number
  coef: number
  pivot?: number
  maxUp: number
  maxDown: number
  exponentUp?: number
  exponentDown?: number
}) {
  const modulationDomain = coef > pivot
    ? [pivot, 1]
    : [pivot, 0]

  const modulationRange = coef > pivot
    ? [0, maxUp * (1 - score)]
    : [0, -maxDown * score]

  const modulationExponent = coef > pivot
    ? exponentUp
    : exponentDown

  const modulation = d3.scalePow()
    .exponent(modulationExponent)
    .domain(modulationDomain)
    .range(modulationRange)
    .clamp(true)

  return score + modulation(coef)
}
