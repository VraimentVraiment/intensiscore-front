<script lang="ts" setup>
import { NuxtLink } from '#components'

withDefaults(defineProps<ButtonProps>(), {
  size: 'md',
  to: undefined,
  target: undefined,
  href: undefined,
  noBorder: false,
  icon: undefined,
  label: undefined,
  onClick: () => undefined,
})

defineEmits(['file:change'])

const btn = ref<HTMLButtonElement | null>(null)
const focus = () => {
  btn.value?.focus()
}
defineExpose({ focus })
</script>

<template>
  <button
    ref="btn"
    :class="{
      'button': true,
      'button--primary': !secondary && !tertiary,
      'button--secondary': secondary && !tertiary,
      'button--tertiary': tertiary,
      'button--no-border': noBorder,
      'button--sm': size === 'sm',
      'button--md': size === 'md',
      'button--lg': size === 'lg',
      'button--icon-left': !iconOnly && iconRight,
      'button--icon-only': iconOnly,
    }"
    :title="iconOnly ? label : undefined"
    :disabled="disabled"
    :aria-disabled="disabled"
    :style="iconOnly ? { 'padding-inline': '0.5rem' } : {}"
    @click="() => {
      if (type === 'file') {
        btn?.querySelector('input')?.click()
      }
      if (to || href) {
        btn?.querySelector('a')?.click()
      }
      return onClick ? onClick($event as MouseEvent) : () => { }
    }"
  >
    <component
      :is="to ? NuxtLink : href ? 'a' : 'span'"
      v-if="!iconOnly"
      class="button__label"
      tabindex="-1"
      :to="to"
      :href="href"
      :target="target"
      :download="download"
    >
      {{ label }}
      <input
        v-if="type === 'file'"
        type="file"
        style="display: none"
        @change="$emit('file:change', $event)"
      >
      <slot />
    </component>
    <span
      v-if="icon"
      :class="[
        'button__icon',
        { 'button__icon--lg': iconOnly },
      ]"
    >
      <Icon :name="icon" />
    </span>
  </button>
</template>
