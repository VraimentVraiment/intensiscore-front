import * as d3 from 'd3'

export function useWeeksRangesModel(initialValue: number[]) {
  const months = getYearMonths()

  const weeksIds = d3.range(1, N_WEEKS_PER_YEAR + 1)
  const hoverRangeStartWeek = ref<number | null>(null)
  const hoverRange = ref<Set<number>>(new Set())
  const selectedWeeks = ref<Set<number>>(new Set(initialValue))

  const selectAll = () => {
    selectedWeeks.value = new Set(weeksIds)
  }

  const clearAll = () => {
    selectedWeeks.value.clear()
  }

  const handleClick = (weekId: number, toolMode: 'select' | 'deselect') => {
    if (hoverRangeStartWeek.value === null) {
      hoverRangeStartWeek.value = weekId
    }
    else {
      const newIds = [hoverRangeStartWeek.value, ...hoverRange.value]
      newIds
        .forEach((id) => {
          if (toolMode === 'select') {
            if (!selectedWeeks.value.has(id)) {
              selectedWeeks.value.add(id)
            }
          }
          else {
            selectedWeeks.value.delete(id)
          }
        })
      hoverRange.value.clear()
      hoverRangeStartWeek.value = null
    }
  }

  const handleClickOutside = () => {
    if (hoverRangeStartWeek.value !== null) {
      hoverRange.value.clear()
      hoverRangeStartWeek.value = null
    }
  }

  const handleHover = (weekId: number) => {
    if (hoverRangeStartWeek.value !== null) {
      weeksIds.forEach((id) => {
        if (
          (
            id > hoverRangeStartWeek.value!
            && id <= weekId
          )
          || (
            id < hoverRangeStartWeek.value!
            && id >= weekId
          )
        ) {
          hoverRange.value.add(id)
        }
        else if (hoverRange.value.has(id)) {
          hoverRange.value.delete(id)
        }
      })
    }
  }

  const isDisabled = (weekId: number) => {
    return (
      hoverRangeStartWeek.value !== null
      && weekId !== hoverRangeStartWeek.value
      && !hoverRange.value.has(weekId)
    )
  }

  const isPressed = (weekId: number) => {
    return hoverRangeStartWeek.value === weekId
  }

  const isInSelectionRange = (weekId: number) => {
    return selectedWeeks.value.has(weekId)
  }

  const isInHoverRange = (weekId: number) => {
    return hoverRange.value.has(weekId)
  }

  return {
    months,
    weeksIds,
    hoverRangeStartWeek,
    selectedWeeks,
    selectAll,
    clearAll,
    handleClick,
    handleClickOutside,
    handleHover,
    isDisabled,
    isPressed,
    isInSelectionRange,
    isInHoverRange,
  }
}
