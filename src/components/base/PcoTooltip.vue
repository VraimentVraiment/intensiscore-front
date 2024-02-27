<script lang="ts" setup>
import { useMouse } from '@vueuse/core'

defineProps<{
  visible: boolean
}>()

const { x, y } = useMouse({ touch: false })

const TOOLTIP_OFFSET = 12
const isOnLeft = computed(() => x.value < window.innerWidth / 2)
const tooltipPosition = computed(() => {
  return {
    top: `${y.value + TOOLTIP_OFFSET}px`,
    left: `${x.value + TOOLTIP_OFFSET}px`,
    transform: isOnLeft.value ? 'none' : `translateX(-100%) translateX(-${TOOLTIP_OFFSET}px)`,
  }
})
</script>

<template>
  <div
    :class="{
      'tooltip': true,
      'tooltip--visible': visible,
    }"
    :style="tooltipPosition"
  >
    <div
      class="tooltip__content"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.tooltip {
  display: none;
  position: absolute;
  overflow: hidden;
  background-color: $background--default;
  border-radius: calc($border-radius--sm + 2px);
  border: solid 1px $alt-border--default;
  z-index: 1;
  width: 80%;
  max-width: 18rem;
  box-shadow: $shadow--lg;

  &--visible {
    display: block;
  }
}
</style>
