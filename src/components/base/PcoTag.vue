<script lang="ts" setup>
const props = defineProps<TagProps>()
const emit = defineEmits(['update:isActive'])
const handleClick = () => {
  if (!props.isClickable) {
    return
  }
  emit('update:isActive', !props.isActive)
}
</script>

<template>
  <div
    :class="[
      'tag',
      { 'tag--xs': props.size === 'xs' },
      { 'tag--sm': props.size === 'sm' },
      { 'tag--lg': props.size === 'lg' },
      { 'tag--clicked': isActive },
      { 'tag--clickable': isClickable },
    ]"
    @click.stop="handleClick"
  >
    <span class="tag__label">
      #{{ name }}
    </span>
    <span class="tag__icon">
      <Icon
        v-if="isActive"
        name="ri:close-line"
      />
    </span>
  </div>
</template>

<style scoped lang="scss">
.tag {
  padding: .5em 1em;
  border-radius: 1.25em;
  background-color: $tag-bg;
  font-weight: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25em;
  line-height: 1.2;
  font-size: 1rem;

  &--xs {
    font-size: 0.75rem;
  }

  &--sm {
    font-size: 0.9rem;
  }

  &__label {
    font-size: 0.85em;
  }

  &__icon {
    display: none;
    width: 1em;
    height: 1em;
  }

  &.tag--clickable {
    cursor: pointer;
    color: $alt-text--default;
    background: $alt-background--active;
    padding: .5em 1.25em;

    &:hover {
      background-color: $alt-background--hover;
      color: $alt-text--default;
    }

    &:active {
      background-color: $contrast-background--active;
      color: $contrast-text--default;
    }

    &.tag--clicked {
      background-color: $contrast-background--default;
      color: $contrast-text--default;
      padding: .5em .5em 0.5em .75em;
      box-shadow: $shadow--md;

      .tag__icon {
        display: flex;
        align-items: center;
        justify-content: center;

        :deep(svg) {
          width: 100%;
          height: 100%;
        }
      }

      &:hover {
        background-color: $contrast-background--hover;
        color: $contrast-text--default;
      }

      &:active {
        background-color: $contrast-background--active;
        color: $contrast-text--default;
      }
    }
  }
}
</style>
