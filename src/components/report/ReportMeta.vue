<script setup lang="ts">
defineProps<{
  surveyLabel?: string
  reportDate: string | null
}>()
</script>

<template>
  <div class="flex flex-col gap-2">
    <h3
      v-if="surveyLabel"
      class="text-lg m-0"
    >
      "{{ surveyLabel }}"
    </h3>
    <p
      v-if="reportDate"
      class="text-sm text-gray-500 m-0"
    >
      Questionnaire terminé le {{ reportDate }}
    </p>
  </div>
</template>
