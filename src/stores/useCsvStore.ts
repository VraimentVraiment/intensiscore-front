import type * as d3 from 'd3'

const STORE_OPTIONS = {
  persist: true,
}

export const useCsvStore = defineStore('csv', () => {
  const csv = ref<d3.DSVRowArray>()
  const fileName = ref<string>()

  const setCsv = (data: d3.DSVRowArray) => {
    csv.value = data
  }

  const setFileName = (name: string) => {
    fileName.value = name
  }

  const reset = () => {
    csv.value = undefined
  }

  const columns = computed(() => {
    if (!csv.value) {
      return []
    }
    return Object.keys(csv.value[0])
  })

  return {
    csv,
    fileName,
    columns,
    parseCsv,
    setCsv,
    setFileName,
    reset,
  }
}, STORE_OPTIONS)
