import { defineStore } from 'pinia'

export const useSelectedWeekSliceStore = defineStore('selectedWeekSlice', () => {
  const selectedWeekSlice = ref<WeekSliceGroupKey>('all')

  return {
    selectedWeekSlice,
  }
})
