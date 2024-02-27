<script setup lang="ts" generic="T">
import { useElementSize } from '@vueuse/core'
import * as d3 from 'd3'

const props = defineProps<{
  data: T[]
  tilingMethod: 'binary' | 'squarify' | 'slice' | 'dice' | 'slice-dice' | 'resquarify'
  options: TreemapOptions<T>
}>()

const emit = defineEmits(['node:mouseover', 'node:mouseout'])

const chartcontainer = ref<HTMLDivElement | null>(null)
const {
  width,
  height,
} = useElementSize(chartcontainer)

const getTilingMethod = (method: string) => {
  switch (method) {
    case 'binary':
      return d3.treemapBinary
    case 'squarify':
      return d3.treemapSquarify
    case 'slice':
      return d3.treemapSlice
    case 'dice':
      return d3.treemapDice
    case 'slice-dice':
      return d3.treemapSliceDice
    case 'resquarify':
      return d3.treemapResquarify
  }
}

onMounted(() => {
  watchEffect(() => {
    if (chartcontainer.value) {
      chartcontainer.value.innerHTML = ''
      const {
        node: chartNode,
        on,
      } = renderTreemap<T>(props.data, {
        width: width.value,
        height: height.value,
        tile: getTilingMethod(props.tilingMethod),
        ...props.options,
      })
      chartcontainer.value.appendChild(chartNode)
      on('mouseover', function (this: SVGElement) {
        const datum = d3.select<SVGElement, d3.HierarchyNode<T>>(this).datum()
        emit('node:mouseover', datum)
      })
      on('mouseout', function () {
        emit('node:mouseout')
      })
    }
  })
})
</script>

<template>
  <div
    ref="chartcontainer"
    class="charts-container"
  />
</template>

<style scoped lang="scss">
.charts-container {
  resize: both;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
  height: min(60vh, 600px);
}
</style>
