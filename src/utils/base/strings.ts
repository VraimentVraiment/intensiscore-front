export function getAlphabetLetter(index: number): string {
  const FIRST_LETTER_INDEX = 97
  return String.fromCharCode(FIRST_LETTER_INDEX + index)
}

export const capFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

export const getCharOccurences = (data: string, char: string) => {
  let count = 0
  for (let i = 0; i < data.length; i++) {
    if (data[i] === char) {
      count++
    }
  }
  return count
}

export const getFloorLabel = (
  floorId: number,
  isFlatRoof: boolean,
  { format = 'short ' } = {},
): string => {
  if (floorId === 0) {
    if (format === 'long') {
      return 'Rez-de-chaussée'
    }
    else {
      return 'RDC'
    }
  }

  if (isFlatRoof) {
    if (format === 'long') {
      return 'Toit plat'
    }
    else {
      return 'Toit'
    }
  }

  let str = floorId.toString()

  if (floorId > 0) {
    if (floorId === 1) {
      str += 'er'
    }
    else if (floorId > 1) {
      str += 'ème'
    }
    if (format === 'long') {
      str += ' étage'
    }
  }

  if (floorId < 0) {
    if (format === 'long') {
      str = `Sous-sol ${floorId}`
    }
  }

  return str
}
