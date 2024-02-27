<script lang="ts" setup>
defineProps<{
  values: {
    color: string
    label: string
  }[] | null
}>()
</script>

<template>
  <div
    :class="[
      'color-scale-legend',
      'flex flex-row flex-wrap gap-x-8 gap-y-3',
    ]"
  >
    <div
      v-for="{ color, label } in values"
      :key="color"
      class="inline"
    >
      <div
        :class="[
          'color-watch',
          'inline-block h-1em w-1em mr-0.5em border border-solid border-border-default',
          'transform translate-y-0.2em',
        ]"
        :style="{ backgroundColor: color }"
      />
      <p
        class="text-xs m-0 inline"
      >
        {{ label }}
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.color-watch {
  border-radius: $border-radius--sm;
  box-shadow: $shadow--sm;
}
</style>
