<script setup lang="ts">
import {
  type SurveyModel,
} from 'survey-core'

const props = defineProps<{
  model: SurveyModel
}>()

const value = computed(() => {
  return props.model.progressValue + '%'
})
</script>

<template>
  <div class="progressbar">
    <div class="progressbar__indicator-container">
      <div
        class="progressbar__indicator"
        :style="{ width: value }"
      />
    </div>
    <div class="progressbar__value">
      <span> {{ value }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.progressbar {
  margin-bottom: 1rem;

  &__indicator-container {
    height: 1rem;
    background: $background--default;
    border: 1px solid $border--default;
    border-radius: $border-radius--sm;
    overflow: hidden;
    box-shadow: $shadow--md;
  }

  &__indicator {
    width: 100%;
    height: 100%;
    background-color: $contrast-background--default;
  }

  &__value {
    padding: 0.5rem;
    font-size: 0.9rem;
    font-weight: 700;
    color: $alt-text--default;
  }
}
</style>
