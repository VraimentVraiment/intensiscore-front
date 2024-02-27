import * as d3 from 'd3'

export const getSeparator = (data: string) => {
  try {
    const separators = [',', ';', '\t']
    const sample = data.slice(0, 1000)
    const occurrences = separators.map(separator => getCharOccurences(sample, separator))
    const maxIndex = d3.maxIndex(occurrences)
    return separators[maxIndex]
  }
  catch {
    return ','
  }
}

export const parseCsv = (data: string): d3.DSVRowArray => {
  const separator = getSeparator(data)
  return d3
    .dsvFormat(separator)
    .parse(data)
}
