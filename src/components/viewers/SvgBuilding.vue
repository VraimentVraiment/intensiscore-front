<script setup lang="ts">
import * as d3 from 'd3'

const props = defineProps<{
  floorsWithUsages: FloorWithUsages[]
  usagesScores: UsageScore[]
  floorsScores: FloorScore[]
  usagesIds: UsageIds[]
  renderMode: SvgBuildingRenderMode
}>()

const emit = defineEmits<{
  (e: 'usage-mousedown' | 'usage-mouseover', value: FloorWithUsages | WithUsageId): void
  (e: 'usage-mouseout'): void
}>()

const buildingview = ref(null)
const nFloors = props.floorsWithUsages.length

const N_FLOORS_DOMAIN = [1, 60]
const HEIGHT_RANGE = [180, 320]
const SVG_WIDTH = 300

const heightScale = d3.scaleLog()
  .domain(N_FLOORS_DOMAIN)
  .rangeRound(HEIGHT_RANGE)
  .clamp(true)

onMounted(() => {
  const svg = d3.select(buildingview.value)
    .append('svg')
    .attr('width', SVG_WIDTH)
    .style('width', '100%')
    .style('height', 'auto')

  watchEffect(() => {
    const height = heightScale(nFloors)
    svg
      .attr('height', height)
      .attr('viewBox', `0 0 ${SVG_WIDTH} ${height}`)
    const {
      onMouseOver,
      onMouseOut,
      onMouseDown,
    } = renderBuilding({
      svg,
      floorsWithUsages: props.floorsWithUsages,
      floorsScores: props.floorsScores,
      usagesScores: props.usagesScores,
      usagesIds: props.usagesIds,
      renderMode: props.renderMode,
    })

    onMouseOver((event) => {
      emit('usage-mouseover', event)
    })

    onMouseDown((event) => {
      emit('usage-mousedown', event)
    })

    onMouseOut(() => {
      emit('usage-mouseout')
    })
  })
})
</script>

<template>
  <div
    ref="buildingview"
    class="flex justify-center items-center"
  />
</template>
