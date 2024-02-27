<script setup lang="ts">
const props = withDefaults(defineProps<{
  score: number
  size?: 'sm' | 'md' | 'lg'
  vertical?: boolean
  reverse?: boolean
}>(), {
  size: 'md',
  vertical: false,
  reverse: false,
})

const sizes = {
  sm: {
    swatchSize: 20,
    scoreFontSize: 16,
  },
  md: {
    swatchSize: 24,
    scoreFontSize: 20,
    strokeWidth: 2,
  },
  lg: {
    swatchSize: 28,
    scoreFontSize: 24,
    strokeWidth: 2,
    labelOffset: 14,
  },
}

const svgcontainer = ref<HTMLElement | null>(null)
onMounted(() => {
  watchEffect(() => {
    const child = svgcontainer.value?.firstChild as Node
    if (child) {
      svgcontainer.value?.removeChild(child)
    }
    const svg = renderScore(scoreQuantizeColors, getMappedScore(props.score), {
      showScoreLabel: true,
      paddingBottom: 18,
      vertical: props.vertical,
      reverse: props.reverse,
      scoreSwatchRatio: 2,
      ...sizes[props.size],
      labels: scoreInterpretationLabel,
    })

    if (svg && svgcontainer.value) {
      svgcontainer.value?.appendChild(svg)
    }
  })
})
</script>

<template>
  <div ref="svgcontainer" />
</template>
