import * as d3 from 'd3'

export const SCORE_N_COLORS = 5
export const SCORE_RAW_EXTENT = [0, 1]
export const SCORE_MAPPED_EXTENT = [0, SCORE_N_COLORS]
export const MAPPED_SCORE_N_DECIMALS = 1

export const scoreInterpretationLabel = [
  'Très faible',
  'Faible',
  'Moyen',
  'Fort',
  'Très fort',
]

export const scoreInterpretation = [
  'très faible intensité d\'usage',
  'faible intensité d\'usage',
  'intensité d\'usage moyenne',
  'forte intensité d\'usage',
  'très forte intensité d\'usage',
]

export const scoreOpportunities = [
  'énorme potentiel d\'intensification',
  'très fort potentiel d\'intensification',
  'fort potentiel d\'intensification',
  'bon potentiel d\'intensification',
  'potentiel d\'intensification marginal',
]

export const scoreOpportunitesDetails = [
  'Tout reste à faire, votre potentiel d\'intensification est énorme !',
  'Votre batiment est très peu utilisé, vous avez une belle marge de manœuvre pour intensifier ses usages !',
  'Vous êtes dans la moyenne des niveaux d\'intensité, votre score peut être largement amélioré !',
  'Bravo, votre batiment est déjà bien optimisé, vous pouvez faire encore mieux !',
  'Félicitations, vous avez déjà mis en oeuvre de l\'intensification dans votre bâtiment, une petite marche peut être encore franchie !',
]

// export const scoreColorInterpolator = d3.interpolateYlGnBu
export const scoreColorInterpolator = d3.interpolateRgbBasis(['#ffffcc', '#9ed8af', '#42aaac', '#006c90', '#0b3061'])
export const scoreQuantizeColors = d3.quantize(scoreColorInterpolator, SCORE_N_COLORS)

export const scoreTicks = d3
  .ticks(SCORE_RAW_EXTENT[0], SCORE_RAW_EXTENT[1], SCORE_N_COLORS)

export const scoreTresholds = scoreTicks
  .slice(1, -1)

/**
 * Thresholds scales
 */

/** Given a raw score (0-1), returns a color */
export const getScoreColor = d3
  .scaleThreshold<number, string>()
  .domain(scoreTresholds)
  .range(scoreQuantizeColors)

/** Given a raw score (0-1), returns a string (the long score interpretation) */
export const getScoreInterpretation = d3.scaleThreshold<number, string>()
  .domain(scoreTresholds)
  .range(scoreInterpretation)

/** Given a raw score (0-1), returns a string (the short score interpretation) */
export const getScoreInterpretationLabel = d3.scaleThreshold<number, string>()
  .domain(scoreTresholds)
  .range(scoreInterpretationLabel)

/** Given a raw score (0-1), returns a string (the score opportunity) */
export const getScoreOpportunity = d3.scaleThreshold<number, string>()
  .domain(scoreTresholds)
  .range(scoreOpportunities)

export const getScoreOpportunityDetails = d3.scaleThreshold<number, string>()
  .domain(scoreTresholds)
  .range(scoreOpportunitesDetails)
/**
 * Mapped score scales
 */

/** Given a raw score (0-1), returns a mapped score (0-5) */
export const getMappedScore = (rawScore: number): number => {
  const scale = d3.scaleLinear()
    .domain(SCORE_RAW_EXTENT)
    .range(SCORE_MAPPED_EXTENT)
    .clamp(true)

  return toFixedNumber(scale(rawScore), MAPPED_SCORE_N_DECIMALS)
}

/** Given a mapped score (0-5), returns a raw score (0-1) */
export const getRawScore = (mappedScore: number): number => {
  const scale = d3.scaleLinear()
    .domain(SCORE_MAPPED_EXTENT)
    .range(SCORE_RAW_EXTENT)
    .clamp(true)

  return scale(mappedScore)
}

/** Given a mapped score as a number (0-5), returns a formatted string */
export const formatScore = (mappedScore: number | null): string | null => {
  return mappedScore
    ?.toString()
    ?.replace('.', ',')
    ?? null
}

/**
 * Ordinal scales
 */

export const mappedScoreOrdinalDomain = scoreTicks.map(getMappedScore)
export const mappedScoreOrdinalColorRange = scoreTicks.map(getScoreColor)

/** Given a mapped score (0-5), returns a color */
export const scoreOrdinalScale = d3.scaleOrdinal<number, string>()
  .domain(mappedScoreOrdinalDomain)
  .range(mappedScoreOrdinalColorRange)

/** Given a mapped score (0-5), returns a string (the score interpretation) */
export const getScoreShortLabel = d3.scaleOrdinal<number, string>()
  .domain(mappedScoreOrdinalDomain)
  .range(scoreInterpretation)
