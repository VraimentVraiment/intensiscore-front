import * as d3 from 'd3'

type FaceSectionDatum = {
  color: string
  width: number
  value: WithUsageId | FloorWithUsages
}

type BuildingPointerEventCallback = (value: WithUsageId | FloorWithUsages) => void

const getDarkerColor = (color: string) => {
  const colorRgb = d3.color(color)
  if (!colorRgb) {
    return color
  }
  return colorRgb.darker(0.5).toString()
}

export const renderBuilding = ({
  svg,
  floorsWithUsages,
  usagesScores,
  usagesIds,
  floorsScores,
  renderMode = 'usages',
  angle = 15,
  strokeWidth = 2,
}: {
  svg: d3.Selection<SVGSVGElement, unknown, null, unknown>
  floorsWithUsages: FloorWithUsages[]
  usagesScores: UsageScore[]
  usagesIds: UsageIds[]
  floorsScores: FloorScore[]
  renderMode?: SvgBuildingRenderMode
  angle?: number
  strokeWidth?: number
}) => {
  const GROUND_OFFSET = 30
  const bottomOffset = floorsWithUsages.filter(f => f.id < 0).length ? 0 : GROUND_OFFSET * sinDeg(angle)
  const nFloors = floorsWithUsages.length
  const width = parseInt(svg.attr('width'))
  const height = parseInt(svg.attr('height'))
  const floorWidth = ((width - (GROUND_OFFSET * 2) - strokeWidth) / 2) / cosDeg(angle)
  const topFaceProjectedHeight = 2 * (floorWidth) * sinDeg(angle)
  const floorHeight = (height - topFaceProjectedHeight - bottomOffset - strokeWidth) / nFloors
  const matrixes = getAxonometricTransformMatrixes(floorWidth, angle)

  const getUsageColor = (usageWithId: WithUsageId) => {
    if (isActuallySecondary(usageWithId)) {
      return '#fff'
    }
    const usage = usagesIds.find((u) => {
      return isSameUsage(u, usageWithId)
    })
    if (renderMode === 'usages') {
      if (!usage) {
        return UNKNOWN_CATEGORY.color
      }
      return getCategoryColor(getUsageCategory(usage), { dark: true })
    }
    else {
      if (!usage) {
        return getScoreColor(0)
      }
      const usageScore = usagesScores.find(u => isSameUsage(usage, u))?.score
      if (usageScore === null || usageScore === undefined) {
        return '#fff'
      }
      return getScoreColor(usageScore)
    }
  }

  const getFloorData = (floor: FloorWithUsages): FaceSectionDatum[] => {
    if (renderMode === 'floors-scores') {
      const floorScore = floorsScores.find(f => f.id === floor.id)?.score ?? null
      const floorColor = typeof floorScore === 'number' ? getScoreColor(floorScore) : '#fff'
      return [{
        color: floorColor,
        width: floorWidth,
        value: floor,
      }]
    }
    else {
      return floor.usages
        .map((usage) => {
          return {
            color: getUsageColor(usage),
            width: floorWidth / (floor?.usages.length || 1),
            value: usage,
          }
        })
    }
  }

  const getDatumValue = (selection: SVGElement) => {
    const datum = d3.select(selection).datum() as FaceSectionDatum
    return datum.value
  }

  const getSectionSiblings = (selection: SVGElement) => {
    if (renderMode === 'floors-scores') {
      const floor = getDatumValue(selection)
      return d3.selectAll<SVGElement, FaceSectionDatum>('.floor')
        .filter(d => d.id === floor.id)
        .selectAll('.usage__zone')
    }
    else {
      const usage = getDatumValue(selection)
      return d3.selectAll<SVGElement, FaceSectionDatum>('.usage__zone')
        .filter(d => isSameUsage(usage, d.value))
    }
  }

  // Remove previous building
  svg
    .select('.building')
    .remove()

  // Render building
  const building = svg
    .append('g')
    .classed('building', true)
    .attr('transform', () => {
      const x = GROUND_OFFSET + strokeWidth / 2
      const y = height - bottomOffset - topFaceProjectedHeight - floorHeight - strokeWidth / 2
      return `translate(${x} ${y})`
    })

  // Render floors
  const floors = building
    .selectAll('.floor')
    .data(floorsWithUsages)
    .enter()
    .append('g')
    .classed('floor', true)
    .attr('transform', (_, i) => `translate(0, ${-floorHeight * i})`)

  // Use only the top floor for the top faces
  const topFloor = floors
    .filter((_, i) => i === nFloors - 1)

  // Get the ground floor to render the floor plan
  const groundFloor = floors
    .filter(f => f.id === 0)

  // Render left faces groups
  const leftFace = floors
    .append('g')
    .classed('face', true)
    .classed('left', true)

  // Render top faces groups
  const topFace = topFloor
    .append('g')
    .classed('face', true)
    .classed('top', true)

  // Render right faces groups
  const rightFace = floors
    .append('g')
    .classed('face', true)
    .classed('right', true)

  // Render face sections rects for left and top faces
  d3.selectAll<SVGElement, FloorWithUsages>('.left, .top')
    .selectAll('rect')
    .data(getFloorData)
    .enter()
    .append('rect')
    .classed('face__section', true)
    .classed('usage__zone', true)
    .attr('width', d => d.width)
    .attr('height', floorHeight)
    .attr('x', (d, i) => i * d.width)

  leftFace
    .selectAll('rect')
    .attr('height', floorHeight)

  topFace
    .selectAll('rect')
    .attr('height', floorWidth)

  // Render a single face section rect for right face
  rightFace
    .selectAll('rect')
    .data(d => getFloorData(d).slice(-1))
    .enter()
    .append('rect')
    .classed('face__section', true)
    .classed('usage__zone', true)
    .attr('width', floorWidth)
    .attr('height', floorHeight)

  // Render floor plan
  groundFloor
    .insert('g', ':first-child')
    .attr('transform', `translate(0, ${floorHeight})`)
    .append('rect')
    .classed('top', true)
    .datum({ color: 'white' })
    .attr('fill-opacity', '0.5')
    .classed('face__section', true)
    .attr('width', floorWidth + GROUND_OFFSET)
    .attr('height', floorWidth + GROUND_OFFSET)
    .attr('y', -GROUND_OFFSET / 2)
    .attr('x', -GROUND_OFFSET / 2)
    .attr('pointer-events', 'none')

  const onMouseIn = function (this: SVGElement) {
    // disable all sections

    getSectionSiblings(this)
      .each(function () {
        let direction = 1
        const datum = d3.select(this).datum() as FaceSectionDatum
        datum.hovered = true
        const darkerColor = getDarkerColor(datum.color)
        const interpolate = d3.interpolateHcl(datum.color, darkerColor)
        // const interpolate = d3.interpolateRgbBasisClosed([datum.color, color])
        const self = d3.select(this)
        repeat()
        function repeat() {
          if (!datum.hovered) {
            return
          }
          self
            .transition()
            .duration(600)
            .attrTween('fill', function () {
              const getTime = t => direction === -1 ? t : 1 - t
              const ease = d3.easeCubicIn
              return t => interpolate(ease(getTime(t)))
            })
            .on('end', repeat)
          direction = -direction
        }
      })
  }

  const onMouseOut = function () {
    // reset all sections
    d3.selectAll<SVGElement, FaceSectionDatum>('.usage__zone')
      .attr('fill', d => d.color)

    getSectionSiblings(this)
      .each(function () {
        const self = d3.select(this)
        self
          .transition()
          .duration(0)
          .attr('fill', d => d.color)
        self.datum().hovered = false
      })
  }

  const onMouseDown = function (this: SVGElement) {
    // highlight every section with the same usage
    // getSectionSiblings(this)
    //   .attr('fill', d => getDarkerColor(d.color, 0.3))
  }

  const onMouseUp = function (this: SVGElement) {
    // reset all sections
    // getSectionSiblings(this)
    //   .attr('fill', d => d.color)
  }

  floors
    .selectAll<SVGElement, FaceSectionDatum>('.face__section')
    .attr('fill', d => d.color)
    .attr('stroke', 'black')
    .attr('stroke-width', strokeWidth)
    .attr('stroke-linejoin', 'round')
    .attr('vector-effect', 'non-scaling-stroke')

  floors
    .selectAll<SVGElement, FaceSectionDatum>('.usage__zone')
    .attr('cursor', 'pointer')
    .on('mouseover', onMouseIn)
    .on('mouseout', onMouseOut)
    .on('mousedown', onMouseDown)
    .on('mouseup', onMouseUp)

  // Transform faces
  floors.selectAll('.top')
    .attr('transform', matrixes.top)
  floors.selectAll('.left')
    .attr('transform', matrixes.left)
  floors.selectAll('.right')
    .attr('transform', matrixes.right)

  return {
    onMouseDown: (callback: BuildingPointerEventCallback) => {
      floors
        .selectAll<SVGElement, FaceSectionDatum>('.usage__zone')
        .on('mousedown', function () {
          callback(getDatumValue(this))
          onMouseDown.call(this)
        })
    },
    onMouseOver: (callback: BuildingPointerEventCallback) => {
      floors
        .selectAll<SVGElement, FaceSectionDatum>('.usage__zone')
        .on('mouseover', function () {
          callback(getDatumValue(this))
          onMouseIn.call(this)
        })
    },
    onMouseOut: (callback: () => void) => {
      floors
        .selectAll<SVGElement, FaceSectionDatum>('.usage__zone')
        .on('mouseout', function () {
          callback()
          onMouseOut.call(this)
        })
    },
  }
}
