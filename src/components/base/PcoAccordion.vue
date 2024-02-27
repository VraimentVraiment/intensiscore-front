<script setup lang="ts">
const props = defineProps<{
  id?: string
  expandedId: string | null
}>()

defineEmits(['toggle-id'])

const id = props.id ?? useId()
const expandedId = toRef(() => props.expandedId)
const isOpen = computed(() => expandedId.value === id)
</script>

<template>
  <details
    class="custom-accordion"
    :open="isOpen"
  >
    <summary
      :class="[
        'default-action-box',
        'my-1 p-2 font-600 cursor-pointer flex justify-between items-center',
      ]"
      @click.prevent="$emit('toggle-id', id)"
    >
      <div
        :class="[
          'summary',
        ]"
      >
        <slot name="summary" />
      </div>
      <Icon :name="isOpen ? 'ri:arrow-up-s-line' : 'ri:arrow-down-s-line'" />
    </summary>
    <div
      :class="[
        'details-content',
        'pt-1 px-4 pb-6',
      ]"
    >
      <slot name="content" />
    </div>
  </details>
</template>

<style scoped lang="scss">
details>summary {
  &:focus-visible {
    @include shadow-focus;
  }
}

details.custom-accordion {
  border-top: solid 1px $border--default;
  border-bottom: solid 1px $border--default;

  :deep(+ .custom-accordion) {
    border-top: none;
  }
}
</style>
