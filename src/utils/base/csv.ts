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

export const parseCsv = (data: string): any[] => {
  const separator = getSeparator(data)
  const dsvParser = d3.dsvFormat(separator)

  /**
   * Below we are reproducing the behaviour of d3-dsv parse method,
   * because it requires the unsafe-eval content security policy which is blocked by nuxt-security module
   */
  const rows = dsvParser.parseRows(data) // Use dsv.parseRows to parse the CSV data
  const headers = rows[0]
  return rows.slice(1).map((row) => {
    return headers.reduce((acc, header, index) => {
      acc[header] = row[index]
      return acc
    }, {} as Record<string, any>)
  })
}
// export const parseCsv = (data: string): d3.DSVRowArray => {
//   const separator = getSeparator(data)
//   return d3
//     .dsvFormat(separator)
//     .parse(data)
// }
