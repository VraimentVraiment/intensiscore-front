import * as d3 from 'd3'

export function renderScore(
  colors: string[],
  score: number | null,
  {
    /** type of ramp */
    vertical = false,
    reverse = false,
    reverseAxis = false,
    /** swatches */
    swatchSize = 32,
    swatchAspectRatio = 1,
    scoreSwatchRatio = 1.5,
    scoreSwatchCornerRadius = '12.5%',
    strokeWidth = 2,
    scoreFontSize = 18,
    /** labels */
    showEveryLabel = false,
    showScoreLabel = true,
    labels = [] as string[],
    labelOffset = 12,
    labelFontSize = 12,
    scoreLabelFontSize = 13,
    /** ticks */
    tickLength = 6,
    tickFontSize = 11,
    /** paddings */
    paddingTop = 12,
    paddingBottom = 12,
    paddingLeft = 12,
    paddingRight = 12,
    /** misc */
    fontFamily = 'sans-serif',
    strokeColor = 'black',
  } = {}): SVGElement | null {
  const domain = [0, colors.length] as [number, number]
  const tickValues = d3.range(0, colors.length + 1)

  const scoreSwatchSize = score === null
    ? swatchSize
    : swatchSize * scoreSwatchRatio
  const swatchSizes = [swatchSize, swatchAspectRatio * swatchSize]
  if (vertical) {
    swatchSizes.reverse()
  }
  const tickSize = -swatchSizes[0] - tickLength
  const tickOffset = reverseAxis ? -tickLength : tickLength + swatchSizes[0]

  const mainRampSize = swatchSizes[1] * (colors.length - 1) + scoreSwatchSize
  const rampSizes = [
    mainRampSize,
    Math.max(swatchSizes[0], scoreSwatchSize),
  ]
  if (vertical) {
    rampSizes.reverse()
  }

  const paddings = [
    [paddingLeft, paddingRight],
    [paddingTop, paddingBottom],
  ]
  if (vertical) {
    paddings.reverse()
  }

  const range = [paddings[0][0], mainRampSize + paddings[0][0]]
  if (reverse) {
    range.reverse()
  }

  const getTranslation = (positions: [number, number]): string => {
    if (vertical) {
      positions.reverse()
    }
    return `translate(${positions[0]} ${positions[1]})`
  }

  const isScoreSwatch = (i: number) => {
    if (score === null) {
      return false
    }
    return (
      i === Math.floor(score)
      || (score >= colors.length && i === colors.length - 1)
    )
  }

  const getSwatchSizes = (i: number, dimensionIndex: number) => {
    return isScoreSwatch(i) ? scoreSwatchSize : swatchSizes[dimensionIndex]
  }

  const labelScale = labels?.length
    ? d3.scaleOrdinal<string>()
      .domain(colors)
      .range(labels)
    : null

  const mappedScoreScale = d3
    .scaleLinear()
    .domain(domain)
    .range(range)
    .interpolate(
      mappedScoreScaleInterpolator({
        domain,
        nTicks: colors.length,
        pivotValue: score,
        pivotRatio: scoreSwatchRatio,
      }),
    )

  const svg = d3
    .create('svg')
    .attr('width', rampSizes[0] + paddingRight + paddingLeft)
    .attr('height', rampSizes[1] + paddingTop + paddingBottom)

  const groups = svg
    .selectAll('.color')
    .data(colors)
    .enter()
    .append('g')
    .classed('color', true)
    .attr('transform', (_, i) => {
      return getTranslation([
        mappedScoreScale(i + (reverse ? 1 : 0)),
        paddings[0][0] + (scoreSwatchSize - getSwatchSizes(i, 0)) / 2,
      ])
    })

  groups
    .append('rect')
    .attr('width', (_, i) => getSwatchSizes(i, 0))
    .attr('height', (_, i) => getSwatchSizes(i, 1))
    .attr('fill', d => d)

  // Score swatch
  const scoreGroup = groups.filter((_, i) => isScoreSwatch(i))
  scoreGroup
    .select('rect')
    .attr('ry', vertical ? null : scoreSwatchCornerRadius)
    .attr('rx', vertical ? scoreSwatchCornerRadius : null)
    .attr('stroke', strokeColor)
    .attr('stroke-width', strokeWidth)
  scoreGroup
    .append('text')
    .text(formatScore(score))
    .attr('x', scoreSwatchSize / 2)
    .attr('y', 2 + scoreSwatchSize / 2)
    .attr('font-size', scoreFontSize)
    .attr('text-anchor', 'middle')
    .attr('dominant-baseline', 'middle')
    .attr('fill', getContrastColor)

  if (labels) {
    groups
      .filter((_, i) => {
        return (
          (
            showScoreLabel
            && isScoreSwatch(i)
          )
          || (
            showEveryLabel
            && !isScoreSwatch(i)
          )
        )
      })
      .append('text')
      .text((d) => {
        return labelScale?.(d) ?? ''
      })
      .attr('transform', (d) => {
        const i = colors.indexOf(d)
        return getTranslation([
          getSwatchSizes(i, 1) / 2,
          getSwatchSizes(i, 0) + labelOffset,
        ])
      })
      .attr('font-size', (d) => {
        const i = colors.indexOf(d)
        return isScoreSwatch(i) ? scoreLabelFontSize : labelFontSize
      })
      .attr('text-anchor', vertical ? 'start' : 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('fill', strokeColor)
  }

  // Render axis
  const renderAxis = vertical
    ? reverseAxis
      ? d3.axisLeft(mappedScoreScale)
      : d3.axisRight(mappedScoreScale)
    : reverseAxis
      ? d3.axisTop(mappedScoreScale)
      : d3.axisBottom(mappedScoreScale)

  renderAxis
    .tickFormat(d3.format('d'))
    .tickSize(tickSize)
    .tickValues(tickValues)

  const axis = svg
    .append('g')
    .attr('transform', () => {
      return getTranslation([
        0,
        paddings[0][0] + (scoreSwatchSize - swatchSizes[0]) / 2 + tickOffset,
      ])
    })
    .call(renderAxis)

  axis.select('.domain').remove()

  const ticks = axis.selectAll('.tick')

  ticks.select('line')
    .attr('stroke', strokeColor)
    .attr('stroke-width', strokeWidth)

  ticks
    .select('text')
    .attr('fill', strokeColor)
    .attr('font-weight', '400')
    .attr('font-size', tickFontSize)

  ticks
    .filter((d) => {
      if (score === null) {
        return false
      }
      const inferior = Math.min(
        d3.max(tickValues.filter(t => score >= t)) as number,
        colors.length - 1,
      )
      const superior = d3.min(tickValues.filter(t => score < t)) ?? colors.length
      return d === inferior || d === superior
    })
    .remove()

  svg.selectAll('text')
    .attr('font-family', fontFamily)

  scoreGroup.raise()

  return svg.node()
}
