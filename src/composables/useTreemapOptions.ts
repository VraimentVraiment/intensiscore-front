export const useTreemapOptions = ({
  groupKey,
  labelKey,
  areaKey,
  getRowScore,
}: {
  labelKey: Ref<typeof sharedKeys[number]>
  areaKey: Ref<typeof sharedKeys[number]>
  groupKey: Ref<typeof sharedKeys[number]>
  getRowScore: (i: number) => number | null
}) => {
  const treemapOptions: ComputedRef<TreemapOptions<DirectRow | ComputableRow>> = computed(() => {
    const getRowTreemapPath = (row: DirectRow | ComputableRow | null, i?: number) => {
      const path = [
        row?.[groupKey.value],
        row?.[labelKey.value] ?? `${i}`,
      ]
        .filter(Boolean)
        .join('/')

      return path
    }

    const getRowTreemapValue = (row: DirectRow | ComputableRow) => {
      const value = row[areaKey.value]
      return value == null ? 1 : Number(value)
    }

    const getRowTreemapLabel = (row: DirectRow | ComputableRow) => {
      return row[labelKey.value] ?? ''
    }

    const getRowTreemapColor = (row: DirectRow | ComputableRow) => {
      const rowScore = getRowScore(row.id)
      if (rowScore == null) {
        return '#ccc'
      }
      return scoreOrdinalScale(Math.floor(rowScore))
    }

    const getRowTreemapTextColor = (row: DirectRow | ComputableRow) => {
      return getContrastColor(getRowTreemapColor(row))
    }

    return {
      path: getRowTreemapPath,
      value: getRowTreemapValue,
      label: getRowTreemapLabel,
      color: getRowTreemapColor,
      textColor: getRowTreemapTextColor,
      fillOpacity: 0.8,
      paddingInner: 6,
      paddingOuter: 12,
      paddingTop: 6,
      margin: 12,
      groupTextSize: 14,
      leafTextSize: 13,
    }
    // fillOpacity: 0.8,
    // paddingInner: 6,
    // paddingOuter: 12,
    // paddingTop: 24,
    // margin: 12,
  })

  return {
    treemapOptions,
  }
}
