import * as d3 from 'd3'

const bugProbability = 1

const isBuggy = () => {
  return Math.random() < bugProbability
}

const getBug = () => {
  const bugs = [
    // NaN, // this makes the app crash
    // '', // this makes the app crash
    //
    // undefined,
    // null,
    // ' ',
    // 'NaN',
    // 'undefined',
    // 'null',
    // 390,
    // '\n',
  ]
  return bugs[Math.floor(Math.random() * bugs.length)]
}

export const getRandomCsvRow = ({ buggy = false } = {}) => {
  const getName = () => Math.random().toString(36).substring(7)
  const getSurface = () => {
    return d3.randomUniform(20, 1000)()
  }
  const getScore = () => d3.randomBinomial(5, 0.5)()
  const getGroup = () => ['A', 'B', 'C'][Math.floor(Math.random() * 3)]
  return {
    nom_espace: (buggy && isBuggy()) ? getBug() : getName(),
    surface_m2: (buggy && isBuggy()) ? getBug() : getSurface(),
    score_entre_0_et_5: (buggy && isBuggy()) ? getBug() : getScore(),
    groupe: (buggy && isBuggy()) ? getBug() : getGroup(),
  }
}

export const getRandomCsvArray = (length: number, { buggy = false } = {}) => {
  return Array.from({ length }, () => getRandomCsvRow({ buggy }))
}
