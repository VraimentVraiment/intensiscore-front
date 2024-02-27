<script setup lang="ts">
withDefaults(defineProps<{
  isContrast?: boolean
}>(), {
  isContrast: false,
})
</script>

<template>
  <section
    :class="[
      'app-section',
      'site-padding-x py-16 lg:py-20',
      { contrast: isContrast },
    ]"
  >
    <slot />
  </section>
</template>
