export const useCsvScore = (
  csv: Ref<Array<DirectRow | ComputableRow>>,
  useDirectScoreColumn: Ref<boolean>,
  getColumnModel: (key: CsvKey) => string,
) => {
  const computeDirectScore = (row: DirectRow) => {
    const scoreKey = getColumnModel('direct-score') as typeof directKeys[number]
    const value = Number((row as DirectRow)[scoreKey])
    if (isNaN(value)) {
      return null
    }
    return value
  }

  const computeComputableScore = (row: ComputableRow) => {
    const columns = computableKeys.map((key: CsvKey) => getColumnModel(key)) as Array<typeof computableKeys[number]>
    const outputRow = columns.reduce((r, key) => {
      r[key] = row[key]
      return r
    }, {} as ComputableRow)
    return getMappedScore(computeSpaceScore(outputRow))
  }

  const computeRowScore = (d: DirectRow | ComputableRow) => {
    if (useDirectScoreColumn.value) {
      return computeDirectScore(d as DirectRow)
    }
    else {
      return computeComputableScore(d as ComputableRow)
    }
  }

  const rowScores = computed(() => {
    return csv.value
      ?.map((row, i) => {
        const surface = Number(row[getColumnModel('area') as SharedKey])
        return {
          score: computeRowScore(row as ComputableRow),
          surface,
          index: i,
        }
      }) ?? []
  })

  const getRowScore = (i: number): number | null => {
    return rowScores.value
      .find(row => row.index === i)
      ?.score ?? null
  }

  const totalScore = computed(() => {
    const scores = rowScores.value.filter(row => row.score != null && row.surface != null)
    const values = scores.map(row => getRawScore(row.score as number))
    const surfaces = scores.map(row => row.surface)
    const mean = getArithmeticWeightedMean(values, surfaces)
    return mean
  })

  return {
    computeRowScore,
    rowScores,
    getRowScore,
    totalScore,
  }
}
