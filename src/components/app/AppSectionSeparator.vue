<script setup lang="ts">
withDefaults(defineProps<{
  size?: 'sm' | 'md'
  isContrast?: boolean
}>(), {
  size: 'md',
  isContrast: false,
})
</script>

<template>
  <hr
    :class="[
      'site-margin-x',
      'border-none h-1px m-0',
      { 'w-64': size === 'sm' },
      { 'bg-border-default': !isContrast },
      { 'bg-contrast_text-default': isContrast },
    ]"
  >
</template>
