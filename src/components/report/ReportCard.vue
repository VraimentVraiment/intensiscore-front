<script lang="ts" setup>
defineProps<{
  number: number
  date: string
  surveyLabel?: string
}>()

defineEmits(['click'])
</script>

<template>
  <div
    class="report-card"
  >
    <template v-if="surveyLabel">
      <p class="text-xs mb-0">
        Diagnostic <b>n°{{ number }}</b>
      </p>
      <p class="text-lg mt-0 mb-2 font-bold">
        {{ surveyLabel }}
      </p>
    </template>
    <template v-else>
      <p class="text-lg mb-2">
        Diagnostic <b>n°{{ number }}</b>
      </p>
    </template>
    <p class="mt-1 text-sm text-gray-500">
      Le {{ date }}
    </p>
    <div class="flex self-stretch align-end">
      <PcoButton
        class="w-full"
        size="sm"
        secondary
        @click="$emit('click')"
      >
        Consulter le résultat
      </PcoButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
.report-card {
  @apply p-4 bg-bg-default;

  border-radius: $border-radius--md;
  border: solid 1px $border--default;
  box-shadow: $shadow--md;
}
</style>
