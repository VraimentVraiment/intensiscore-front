<script lang="ts" setup>
const svgcontainer = ref<HTMLElement | null>(null)

onMounted(() => {
  const svg = renderScore(scoreQuantizeColors, null, {
    vertical: true,
    swatchSize: 32,
    swatchAspectRatio: 0.5,
    paddingRight: 72,
    paddingLeft: 16,
    showEveryLabel: true,
    showScoreLabel: true,
    reverse: true,
    reverseAxis: true,
    labels: scoreInterpretationLabel,
  })
  if (svg && svgcontainer.value) {
    svgcontainer.value?.appendChild(svg)
  }
})
</script>

<template>
  <div
    ref="svgcontainer"
  />
</template>
