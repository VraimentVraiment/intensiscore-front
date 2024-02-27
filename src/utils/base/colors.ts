import * as d3 from 'd3'

export const getContrastColor = (color: string) => {
  const CONTRAST_TRESHOLD = 70
  const { l } = d3.lab(color)
  return l > CONTRAST_TRESHOLD ? 'black' : 'white'
}
