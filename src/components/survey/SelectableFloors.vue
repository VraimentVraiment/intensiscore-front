<script lang="ts" setup>
defineProps<{
  activeFloorId: number
  floorsWithUsages: FloorWithUsages[]
  isActive: (floorId: number) => boolean
  isEmpty: (floor: FloorWithUsages) => boolean
  isGroundFloor: (floorId: number) => boolean
  isFlatRoof: (floorId: number) => boolean
}>()

defineEmits(['update:activeFloorId'])

const floorscontainer = ref<HTMLElement | null>(null)
onMounted(() => {
  if (floorscontainer.value) {
    floorscontainer.value.scrollTop = floorscontainer.value.scrollHeight
  }
})
</script>

<template>
  <fieldset
    ref="floorscontainer"
    :class="[
      'floors-container',
      'py-2px pr-4 flex flex-col justify-center',
    ]"
  >
    <div
      v-for="floor in floorsWithUsages"
      :key="floor.id"
      :class="[
        'floor',
        { 'floor--active': isActive(floor.id) },
        { 'floor--empty': isEmpty(floor) },
        { 'floor--is-ground-floor': isGroundFloor(floor.id) },
        { 'floor--is-flat-roof': isFlatRoof(floor.id) },
        'w-full flex flex-row items-center justify-stretch gap-2 mt--1px',
      ]"
    >
      <label
        :class="[
          'floor__label',
          'basis-35% shrink-0 grow-1 cursor-pointer h-8 flex items-center justify-start px-2 gap-1 overflow-hidden',
        ]"
      >
        <input
          type="radio"
          name="active-floor"
          :value="floor.id"
          :checked="isActive(floor.id)"
          @change="() => $emit('update:activeFloorId', floor.id)"
        >
        {{ getFloorLabel(floor.id, isFlatRoof(floor.id)) }}
      </label>
      <div
        :class="[
          'floor__view',
          'h-8 flex-1 basis-65% shrink-1 grow-1 flex flex-row justify-stretch',
        ]"
      >
        <div
          v-for="usage in floor.usages"
          :key="getUsageKey(usage)"
          :class="[
            'floor__view-section',
            'flex-1 ',
          ]"
          :data-category="getUsageCategory(usage)"
        />
      </div>
    </div>
  </fieldset>
</template>

<style scoped lang="scss">
.floors-container {
  max-height: min(85vh, 600px);
  overflow-y: auto;
}

.floor {
  &__label {
    @extend %default-action-box;
  }
}

.floor__view {
  border: 1px solid $border--default;
  opacity: 0.7;

  .floor--empty & {
    border: dashed 1px $border--default;
  }

  .floor--active & {
    border: 1px solid $alt-border--default;
    outline: 1px solid $alt-border--default;
    z-index: 1;
    opacity: 1;
  }

  .floor--is-ground-floor & {
    position: relative;

    &::after {
      content: '';
      opacity: 1;
      position: absolute;
      height: 1px;
      bottom: -2px;
      right: -1rem;
      left: -1rem;
      background: $alt-border--default;
      transform: translateY(-50%);
    }
  }
}

.floor__view-section {
  &:not(:last-child) {
    border-right: 1px solid $border--default;
  }

  @include use-category-color {
    background-color: var(--category-color);
  }
}
</style>
