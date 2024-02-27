<!-- eslint-disable import/first -->
<script lang="ts">
import { RendererFactory, ElementFactory, Question, Serializer } from 'survey-core'

const CUSTOM_TYPE = 'custom-weeks-picker'

RendererFactory.Instance.registerRenderer(
  'text',
  'custom-weeks-picker',
  'custom-weeks-picker',
)

export class QuestionCustomWeeksPicker extends Question {
  getType() {
    return CUSTOM_TYPE
  }
}

// Add question type metadata for further serialization into JSON
Serializer.addClass(
  CUSTOM_TYPE,
  [],
  function () {
    return new QuestionCustomWeeksPicker('')
  },
  'question',
)

ElementFactory.Instance.registerElement(CUSTOM_TYPE, (name) => {
  return new QuestionCustomWeeksPicker(name)
})
</script>

<script lang="ts" setup>
// eslint-disable-next-line import/first
import { onClickOutside } from '@vueuse/core'

const props = defineProps<{
  question: QuestionCustomWeeksPicker
}>()

defineOptions({
  inheritAttrs: false,
})

const {
  months,
  weeksIds,
  selectedWeeks,
  selectAll,
  handleClick,
  handleClickOutside,
  handleHover,
  isDisabled,
  isPressed,
  isInSelectionRange,
  isInHoverRange,
} = useWeeksRangesModel(props.question.value ? JSON.parse(props.question.value) : [])

watch(selectedWeeks, (value) => {
  // eslint-disable-next-line vue/no-mutating-props
  props.question.value = JSON.stringify(Array.from(selectedWeeks.value))
}, { deep: true, immediate: true })

onMounted(() => {
  // props.question.value = JSON.stringify(Array.from(selectedWeeks.value))
  if (selectedWeeks.value.size === 0) {
    selectAll()
  }
})

const weekblocks = ref<HTMLElement | null>(null)
onClickOutside(weekblocks, () => {
  handleClickOutside()
})

const toolMode = ref<'select' | 'deselect'>()
</script>

<template>
  <div>
    <div class="flex flex-col md:flex-row gap-8 md:items-end mt-6 mb-6">
      <InlineFieldset
        v-model="toolMode"
        title="Outil"
        type="radio"
        :inputs="[
          { label: 'Désélectionner', value: 'deselect' },
          { label: 'Sélectionner', value: 'select' },
        ]"
      />
      <div class="alt-box flex p-2 items-center py-1">
        <p class="text-sm">
          <b>{{ selectedWeeks.size }}</b>  semaines sélectionnées
        </p>
      </div>
    </div>
    <div
      ref="weekblocks"
      :class="[
        'week-blocks',
        'week-blocks--' + toolMode,
      ]"
    >
      <template
        v-for="weekId in weeksIds"
        :key="weekId"
      >
        <div
          :data-week-id="weekId"
          :class="[
            'week-block text-sm',
            { disable: isDisabled(weekId) },
            { pressed: isPressed(weekId) },
            { 'in-selection-range': isInSelectionRange(weekId) },
            { 'in-hover-range': isInHoverRange(weekId) },
          ]"
          @click="() => handleClick(weekId, toolMode)"
          @mouseover="() => handleHover(weekId)"
        >
          {{ weekId }}
          <div
            v-if="months.some(({ weekIndex }) => weekIndex + 1 === weekId)"
            class="month-label"
          >
            {{ months.find(({ weekIndex }) => weekIndex + 1 === weekId)?.text }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style lang="scss">
@use 'sass:color';

.week-blocks {
  padding: 1rem 1px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem 0;

  @include sm {
    grid-template-columns: repeat(6, 1fr);
  }

  @include md {
    grid-template-columns: repeat(8, 1fr);
  }

  @include lg {
    grid-template-columns: repeat(12, 1fr);
  }

  @include over-xl {
    grid-template-columns: repeat(16, 1fr);
  }
}

.week-block {
  height: 2.25rem;
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  text-align: center;
  cursor: pointer;
  color: $text--default;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
  outline: 1px solid $border--default;
  background-color: $background--default;
  user-select: none;

  &:hover {
    z-index: 6;
    color: $text--hover;
    outline-color: $border--hover;
    background-color: $background--hover;
  }

  &:active {
    z-index: 6;
    color: $text--active;
    outline-color: $border--active;
    background-color: $background--active;
  }

  &.pressed {
    background-color: $contrast-background--default;
    color: $contrast-text--default;
    outline-color: $contrast-border--default;
    border: solid 1px $contrast-border--default;
    z-index: 10;

    &:hover {
      color: $contrast-text--hover;
      outline-color: $contrast-border--hover;
      background-color: $contrast-background--hover;
    }

    &:active {
      color: $contrast-text--active;
      outline-color: $contrast-border--active;
      background-color: $contrast-background--active;
    }
  }

  &.in-selection-range {
    z-index: 8;
    color: $alt-text--default;
    outline-color: $alt-border--default;
    background-color: $alt-background--default;
    border: 1px solid $alt-border--default;

    &:not(.in-hover-range) {
      &:hover {
        color: $alt-text--hover;
        outline-color: $alt-border--hover;
        background-color: $alt-background--hover;
      }

      &:active {
        color: $alt-text--active;
        outline-color: $alt-border--active;
        background-color: $alt-background--active;
      }
    }

    +.in-selection-range {
      &:not(:nth-child(4n + 1)) {
        border-left: 0;
      }

      @include sm {
        &:not(:nth-child(6n + 1)) {
          border-left: 0;
        }
      }

      @include md {
        &:not(:nth-child(8n+1)) {
          border-left: 0;
        }
      }

      @include lg {
        &:not(:nth-child(12n + 1)) {
          border-left: 0;
        }
      }
    }
  }

  &.disable {
    cursor: not-allowed;
    opacity: 0.5;
    border-color: transparent;
    outline-color: transparent;
  }

  &.in-hover-range {
    border-top: 1px solid $alt-border--default;
    border-bottom: 1px solid $alt-border--default;
    border-left: none;
    border-right: none;
    background-color: $alt-background--default;
    outline: none;

    &:hover {
      outline: solid 1px $alt-border--hover;
      border: solid 1px $alt-border--hover;
      z-index: 10;
    }

    &:active {
      background-color: $alt-background--active;
      border: solid 1px $alt-border--active;
      outline: solid 1px $alt-border--active;
      z-index: 10;
    }
  }
}

.month-label {
  position: absolute;
  top: -1.75em;
  left: 0;
  right: 0;
  text-align: center;
  font-size: 0.8rem;
  color: $text--default;
}
</style>
