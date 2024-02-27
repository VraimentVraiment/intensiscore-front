<script setup lang="ts">
import type { NuxtLinkProps } from '#app'

type PcoLinkProps = {
  to: NuxtLinkProps['to']
}

defineProps<PcoLinkProps>()
</script>

<template>
  <NuxtLink
    :class="[
      'pco-link',
      'inline-flex justify-center items-center gap-1',
    ]"
    v-bind="$props"
  >
    <span class="pco-link__text">
      <slot />
    </span>
    <Icon
      :name="'ri:arrow-right-line'"
      class="pco-link__icon"
    />
  </NuxtLink>
</template>

<style scoped lang="scss">
.pco-link {
  padding: 0.25em;
}
</style>
