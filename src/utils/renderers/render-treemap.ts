import * as d3 from 'd3'

export type TNode<Datum> = d3.HierarchyRectangularNode<Datum> & {
  uid?: string
  clipUid?: string
}

type TileMap<Datum> = (node: TNode<Datum>, x0: number, y0: number, x1: number, y1: number) => void

export type TreemapAccessor<Datum, T> = (d: Datum, i?: number, data?: Datum[]) => T

const getRandomId = () => Math.random().toString(16).slice(2)

export type TreemapOptions<Datum> = {
  path: TreemapAccessor<Datum | null, string>
  value: TreemapAccessor<Datum, number>
  label: TreemapAccessor<Datum, string>
  color: TreemapAccessor<Datum, string>
  textColor: TreemapAccessor<Datum, string>

  sort?: (a: d3.HierarchyNode<Datum>, b: d3.HierarchyNode<Datum>) => number
  tile?: TileMap<Datum>

  width?: number
  height?: number
  margin?: number
  marginTop?: number
  marginRight?: number
  marginBottom?: number
  marginLeft?: number
  padding?: number
  paddingInner?: number
  paddingOuter?: number
  paddingTop?: number
  fill?: string
  textFill?: string
  fillOpacity?: number | null
  strokeWidth?: number
  strokeOpacity?: number
  groupTextSize?: number
  leafTextSize?: number
}
// This is a modified version of the treemap code from the d3-treemap package:

// Copyright 2021-2023 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/treemap
export function renderTreemap<Datum>(
  data: Datum[],
  {
    path, // returns an array identifier, imputing internal nodes
    value: getValue, // given a node d, returns a quantitative value (for area encoding; null for count)
    label: getLabel, // given a leaf node d, returns the name to display on the rectangle
    color: getColor, // given a leaf node value, returns a color
    textColor: getTextColor,

    sort = (a, b) => d3.descending(a.value, b.value), // how to sort nodes prior to layout
    tile = d3.treemapBinary, // treemap strategy

    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
    margin = 0, // shorthand for margins
    marginTop = margin, // top margin, in pixels
    marginRight = margin, // right margin, in pixels
    marginBottom = margin, // bottom margin, in pixels
    marginLeft = margin, // left margin, in pixels
    padding = 1, // shorthand for inner and outer padding
    paddingInner = padding, // to separate a node from its adjacent siblings
    paddingOuter = padding, // shorthand for top, right, bottom, and left padding
    paddingTop = paddingOuter, // to separate a node’s top edge from its children
    fill = '#ccc', // fill for node rects (if no group color encoding)
    textFill = '333',
    fillOpacity = 1, // fill opacity for node rects
    strokeWidth = 1, // stroke width for node rects
    strokeOpacity = 1, // stroke opacity for node rects
    groupTextSize = 12, // font size for group labels
    leafTextSize = 12, // font size for leaf labels
  }: TreemapOptions<Datum>): {
    node: SVGSVGElement
    on: (type: string, listener: (event: unknown) => void, options?: boolean | AddEventListenerOptions) => void
  } {
  // Use d3.stratify to convert tabular data to a hierarchy.
  const stratify = (data: Datum[]) => (
    d3
      .stratify<Datum | null>()
      .path(path)(data)
  )
    .each((node) => {
      // We take special care of unknown node that has both a value and children, see
      // https://observablehq.com/@d3/treemap-parent-with-value.
      if (node.children?.length && node.data != null) {
        const child = new d3.Node(node.data)
        node.data = null
        child.depth = node.depth + 1
        child.height = 0
        child.parent = node
        child.id = node.id + '/'
        node.children.unshift(child as d3.HierarchyNode<Datum | null>)
      }
    })

  const root = stratify(data) as TNode<Datum>

  // Compute the values of internal nodes by aggregating from the leaves.
  if (getValue != null) {
    root.sum((d) => {
      const childValue = d ? getValue(d) : 0
      return Math.max(0, childValue)
    })
  }
  else {
    root.count()
  }

  // Sort the leaves (typically by descending value for a pleasing layout).
  if (sort != null) {
    root.sort(sort)
  }

  // Compute the treemap layout.
  d3.treemap<Datum>()
    .tile(tile)
    .size([width - marginLeft - marginRight, height - marginTop - marginBottom])
    .paddingInner((d) => {
      return d.height === 2 ? paddingInner * 4 : paddingInner
    })
    .paddingOuter((d) => {
      if (d.id === '/' && d.height !== 1) {
        return 0
      }
      return d.height === 1 ? paddingOuter : paddingOuter
    })
    .paddingTop((d) => {
      if (d.id === '/' && d.height !== 1) {
        return 0
      }
      if (d.id === '/') {
        return paddingOuter
      }
      if (d.height === 1) {
        return groupTextSize * 1.5 + paddingTop
      }
      return paddingOuter
      // if (d.height === 1) {
      //     return paddingOuter
      // }
      // else {
      //   return paddingOuter
      // }
    })
    .round(true)(root)

  const svg = d3.create('svg')
    .attr('viewBox', [-marginLeft, -marginTop, width, height])
    .attr('width', width)
    .attr('height', height)
    .attr('style', 'width: 100%; max-width: 100%; height: auto; height: intrinsic;')
    .attr('font-family', 'sans-serif')
    .attr('font-size', 10)

  const groups = svg.selectAll('g')
    .data(d3.group(root, d => d.height))
    .join('g')

  const node = groups
    .selectAll('g')
    .data(d => d[1])
    .join('g')
    .attr('transform', d => `translate(${d.x0},${d.y0})`)

  const getRadius = (d: TNode<Datum>) => {
    if (d.height === 1) {
      return 12
    }
    else if (d.height === 0) {
      return 3
    }
    else {
      return 0
    }
  }
  node.append('rect')
    .attr('id', d => (d.uid = `O-${getRandomId()}`))
    .attr('rx', getRadius)
    .attr('ry', getRadius)
    .attr('fill', (d) => {
      if (d.height === 1) {
        return '#fff'
      }
      else if (d.height > 1) {
        return 'none'
      }
      else if (getColor == null) {
        return fill
      }
      else {
        return getColor(d.data)
      }
    })
    .attr('fill-opacity', (d) => {
      if (d.height === 0) {
        return fillOpacity
      }
      else {
        return 1
      }
    })
    .attr('stroke', (d) => {
      if (d.height === 1) {
        return '#999'
      }
      if (d.height === 0) {
        return '#999'
      }
      return null
    })
    .attr('stroke-width', strokeWidth as number)
    .attr('stroke-opacity', strokeOpacity as number)
    .attr('stroke-linejoin', 'round')
    .attr('width', d => d.x1 - d.x0)
    .attr('height', d => d.y1 - d.y0)
    .attr('filter', (d) => {
      if (d.height === 1) {
        return 'url(#group-shadow)'
      }
      else if (d.height === 0) {
        return 'url(#leaf-shadow)'
      }
      return null
    })
  // Render nodes' labels.
  // add shadow filter
  svg
    .append('filter')
    .attr('id', 'text-shadow')
    .append('feDropShadow')
    .attr('flood-color', 'black')
    .attr('flood-opacity', 0.75)
    .attr('dx', 0)
    .attr('dy', 0)
    .attr('stdDeviation', 0.75)

  svg
    .append('filter')
    .attr('id', 'group-shadow')
    .append('feDropShadow')
    .attr('flood-color', 'black')
    .attr('flood-opacity', 0.25)
    .attr('dx', 0)
    .attr('dy', 0)
    .attr('stdDeviation', 5)

  svg
    .append('filter')
    .attr('id', 'leaf-shadow')
    .append('feDropShadow')
    .attr('flood-color', '#000')
    .attr('flood-opacity', 0.25)
    .attr('dx', 0)
    .attr('dy', 0)
    .attr('stdDeviation', 1)

  if (getLabel) {
    const getNodeLabel = (d: TNode<Datum>) => {
      if (getLabel != null && d.height === 0) {
        return getLabel(d.data)
      }
      else if (d.height === 1) {
        return d.id?.split('/')[1]
      }
      return ''
    }
    node
      .append('clipPath')
      .attr('id', d => (d.clipUid = `clip-${getRandomId()}`))
      .append('use')
      .attr('xlink:href', d => new URL(`#${d.uid}`, location as unknown as string).href)

    node
      .append('text')
      .attr('clip-path', d => `url(${new URL(`#${d.clipUid}`, location as unknown as string)})`)
      .attr('x', (d) => {
        if (d.height === 0) {
          return 5
        }
        else if (d.height === 1) {
          return 10
        }
        else {
          return 0
        }
      })
      .attr('y', () => {
        return '1.1em'
      })
      .attr('fill', (d) => {
        if (d.height === 1) {
          return textFill
        }
        else if (d.height > 1) {
          return 'none'
        }
        else if (getTextColor == null) {
          return textFill
        }
        else {
          return getTextColor(d.data)
        }
      })
      .attr('filter', function () {
        const color = d3.select(this)
          .attr('fill')
        if (color === '#fff') {
          return 'url(#text-shadow)'
        }
        return null
      })
      .attr('font-size', (d) => {
        if (d.height === 0) {
          return leafTextSize
        }
        else if (d.height === 1) {
          return groupTextSize
        }
        else {
          return 0
        }
      })
      .text(d => getNodeLabel(d) ?? null)
  }

  return {
    node: svg.node() as SVGSVGElement,
    on: node
      .filter((d) => {
        return d.height === 0
      })
      .on.bind(node),
  }
}
