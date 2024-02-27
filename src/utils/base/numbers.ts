export function toFixedNumber(num: number, digits: number, base = 10) {
  const pow = Math.pow(base, digits)
  return Math.round(num * pow) / pow
}

export const getUniqueValuesLength = (values: number[]): number => {
  const uniqueValues = [...new Set(values)]
  return uniqueValues.length
}
