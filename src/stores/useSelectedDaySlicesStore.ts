import { defineStore } from 'pinia'

export const useSelectedDaySlicesStore = defineStore('selectedDaySlices', () => {
  const selectedDaySlices = ref<DaySliceDef[]>([])

  const daySlicesLabel = computed(() => {
    const length = selectedDaySlices.value.length
    if (length === 0) {
      return 'Toute la journée'
    }
    const s = length > 1 ? 's' : ''
    return `${length} plage${s} horaire${s} sélectionnée${s}`
  })

  return {
    selectedDaySlices,
    daySlicesLabel,
  }
})
